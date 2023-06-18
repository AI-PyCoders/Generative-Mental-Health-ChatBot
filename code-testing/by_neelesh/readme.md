# Data Preparation & LSTM Model - Code Readme

This README provides an overview and explanation of the code related to the code Neelesh is working on. The Jupyter code file consists of two parts: data preparation and the chatbot model.

## Data Preparation

The `data_preparation.py` code is responsible for preparing the training data for the chatbot. It performs the following steps:

1. **Reading the Dataset**: The code reads a dataset containing mental health conversations. The dataset may consist of text data in a suitable format like CSV, JSON, or text files.

2. **Tokenization**: Tokenization is the process of splitting text into smaller units called tokens. In this step, the code tokenizes the conversations from the dataset, converting them into sequences of tokens. Tokens can be words, characters, or subwords, depending on the specific requirements of the chatbot.

3. **Padding**: To ensure that all input sequences have a consistent length, the code pads the sequences. Padding involves adding special tokens (such as `<PAD>`) to the sequences that are shorter than the desired length. This step ensures that all sequences have the same length, which is necessary for training the model.

4. **Data Splitting**: The code splits the prepared data into training and validation sets. The training set is used to train the chatbot model, while the validation set is used to evaluate the model's performance during training.

## Chatbot Model

The second part in the Jupyter file contains the code for defining and training the chatbot model. It follows the following steps:

1. **Importing Libraries**: Imports the required libraries and modules from TensorFlow and Keras.


2. **Model Architecture**: The code defines the architecture of the chatbot model using the Sequential API from TensorFlow and Keras. The architecture typically consists of multiple layers, such as:

   - **Embedding Layer**: An embedding layer converts the tokenized input sequences into dense vector representations. It helps the model learn meaningful representations of words or tokens.

   - **LSTM Layers**: LSTM (Long Short-Term Memory) layers are a type of recurrent neural network (RNN) layer that can capture long-term dependencies in sequential data. Multiple LSTM layers can be stacked to increase the model's capacity to learn complex patterns.

   - **Dense Layer**: A dense layer is a fully connected layer that maps the output of the preceding layers to the desired output shape. In the case of a generative chatbot, the dense layer typically has a softmax activation function to generate the probability distribution over the vocabulary of possible responses.

3. **Model Compilation**: The code compiles the chatbot model by specifying the optimizer and loss function. The optimizer (e.g., Adam) determines how the model is updated based on the computed gradients during training. The loss function (e.g., sparse categorical cross-entropy) measures the discrepancy between the predicted and actual output and serves as the objective that the model tries to minimize.

4. **Model Training**: The code trains the chatbot model using the prepared training data. It fits the model to the training data for a specified number of epochs (iterations) and with a specified batch size. During training, the model learns to generate appropriate responses based on the provided input sequences.


## Error Note

Currently the chatbot model code has the following error:

InvalidArgumentError: Graph execution error: Detected at node 'sparse_categorical_crossentropy/SparseSoftmaxCrossEntropyWithLogits/SparseSoftmaxCrossEntropyWithLogits' defined at (most recent call last):
...
logits and labels must have the same first dimension, got logits shape [32,62709] and labels shape [1600]

This error indicates a shape mismatch between the predicted logits and the actual labels. Please ensure that the dimensions of your training inputs (`train_inputs`) and training outputs (`train_outputs`) are correct and aligned. Double-check the shapes of your data and ensure that the number of training examples matches the batch size used during training.

## Usage

To use the code, follow these steps:

1. Make sure you have the required dependencies installed (specified in `requirements.txt`).
2. Run the `data_preparation.py` script to prepare the training data.
3. Execute the second part in the file to define and train the chatbot model.
4. Use the trained model to generate responses based on user input.


