import numpy as np
import pickle
import string
import re
import random
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import sys

import os
# Disable stdout printing
def blockPrint():
    sys.stdout = open(os.devnull, 'w')
# Enable stdout printing
def enablePrint():
    sys.stdout = sys.__stdout__



# Load the saved model
loaded_model = tf.keras.models.load_model("public/FINAL_models/PD_Bidirectional_model.h5")
# Convert the model to JSON
model_json = loaded_model.to_json()
    
# Load the tokenizer
with open("public/FINAL_models/PD_Bidirectional_tokenizer.pkl", "rb") as file:
    loaded_tokenizer = pickle.load(file)


pattern = r'[^A-Za-z\s]'
clean_str = lambda s: re.sub(pattern, '', str(s)).lower()

def print_seq(seq,tokenizer):
    return tokenizer.sequences_to_texts([seq])[0]
    
def beam_search_decoder(model, input_sequence, tokenizer, beam_width, max_len, gen_len):
    # Initialize beam search
    sequences = [[[], 0.0]]
    
    # Iterate through each prediction step
    for _ in range(gen_len):
        all_candidates = []
        # Prepare inputs for batch prediction
        input_seqs = np.array([seq + [0] * (max_len - len(seq)) for seq, _ in sequences])
        input_seqs = pad_sequences(input_seqs, maxlen=max_len)
#         # Getting Generating outputs of all the beams
#         for i in range(len(input_seqs)):
#             print(tokenizer.sequences_to_texts([input_seqs[i]])[0]) 
        # Predict for all candidates in a batch
        preds = model.predict([np.tile(input_sequence, (len(sequences), 1)), input_seqs],verbose = 0)
        # Generate candidates for each sequence
        for i, (seq, score) in enumerate(sequences):
            if len(seq) > 0:
                pred = preds[i][-1]
                top_scores_indices = np.argsort(pred)[-beam_width:]
                for index in top_scores_indices:
                    candidate = [seq + [index], score + np.log(pred[index])]
                    all_candidates.append(candidate)
            else:
                pred = model.predict([input_sequence, np.zeros((1, max_len))],verbose = 0)[0][-1]
                top_scores_indices = np.argsort(pred)[-beam_width:]

                for index in top_scores_indices:
                    candidate = [[index], score + np.log(pred[index])]
                    all_candidates.append(candidate)

        # Select top-k candidates
        ordered = sorted(all_candidates, key=lambda x: x[1], reverse=True)
        sequences = ordered[:beam_width]
    return sequences

def generate_response(input_text, model, tokenizer):
    input_seq = tokenizer.texts_to_sequences([clean_str(input_text)])
    max_len, gen_len, beam_width = 110,30,1
    input_seq = pad_sequences(input_seq, maxlen=max_len, padding='post')
#     print('User Tokenized:',tokenizer.sequences_to_texts(input_seq)[0])
    top_k_sequences = beam_search_decoder(model, input_seq, tokenizer, beam_width, max_len, gen_len)
    decoded_sequences = [(tokenizer.sequences_to_texts([sequence[0]])[0],sequence[1]) for sequence in top_k_sequences]
    responses, scores = [x[0] for x in decoded_sequences], [x[1] for x in decoded_sequences]
    response = random.choice(responses)
    return response, responses, scores


# Generate a response
# print("Bot: How are you feeling? (pass empty input to exit)")
for line in sys.stdin:
    input_text = line.strip()
    blockPrint()
    response, responses, scores = generate_response(input_text, loaded_model, loaded_tokenizer)
    enablePrint()
    print(response)
    # sys.stdout.write(response)
    # sys.stdout.flush()
