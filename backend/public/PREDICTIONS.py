import numpy as np
import pickle
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
loaded_model = tf.keras.models.load_model("public/Greeting_Attention_trained_model.h5")

# Load the tokenizer
with open("public/Greeting_Attention_tokenizer.pkl", "rb") as file:
    loaded_tokenizer = pickle.load(file)


def beam_search_decoder(model, input_sequence, tokenizer, beam_width, max_len, end_token_index):
    # Initialize beam search
    sequences = [[[], 0.0]]
    
    # Iterate through each prediction step
    for _ in range(max_len):
        all_candidates = []
        
        # Generate candidates for each sequence
        for seq, score in sequences:
            if len(seq) > 0:
                input_seq = pad_sequences([seq], maxlen=max_len)
                pred = model.predict([input_sequence, input_seq])[0][-1]
                top_scores_indices = np.argsort(pred)[-beam_width:]
                
                for index in top_scores_indices:
                    candidate = [seq + [index], score + np.log(pred[index])]
                    all_candidates.append(candidate)
            else:
                # Handle the initial empty sequence
                pred = model.predict([input_sequence, np.zeros((1, max_len))])[0][-1]
                top_scores_indices = np.argsort(pred)[-beam_width:]
                
                for index in top_scores_indices:
                    candidate = [[index], score + np.log(pred[index])]
                    all_candidates.append(candidate)
        
        # Select top-k candidates
        ordered = sorted(all_candidates, key=lambda x: x[1], reverse=True)
        sequences = ordered[:beam_width]
        
        # Check if any sequence ends with the end token
        end_flag = False
        for seq, _ in sequences:
            if seq[-1] == end_token_index:
                end_flag = True
                break
        
        if end_flag:
            break
    
    # Get the sequence with the highest score
    best_sequence = sequences[0][0]
    
    # Convert token indices to text
    decoded_sequence = tokenizer.sequences_to_texts([best_sequence])[0]
    
    return decoded_sequence


def generate_response(input_text, model, tokenizer):
    input_seq = tokenizer.texts_to_sequences([input_text])
    input_seq = pad_sequences(input_seq, maxlen=50, padding='post')
    decoded_sequence = beam_search_decoder(model, input_seq, tokenizer, beam_width=3, max_len=50, end_token_index=2)
    return decoded_sequence


# Generate a response
# print("Bot: How are you feeling? (pass empty input to exit)")

for line in sys.stdin:
    input_text = line.strip()
    blockPrint()
    response = generate_response(input_text, loaded_model, loaded_tokenizer)
    enablePrint()
    print(response)
    # sys.stdout.write(response)
    # sys.stdout.flush()
