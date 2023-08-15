import { PythonShell } from "python-shell";
// Define a function to communicate with the Python script
function runModel(inputText) {
  return new Promise((resolve, reject) => {
    // Create a PythonShell instance
    const pyshell = new PythonShell("public/PREDICTIONS_v2.py");
    // Send the input to the Python script
    pyshell.send(inputText);
    // Receive the output from the Python script
    pyshell.on("message", (message) => {
      resolve(message);
    });
    // Handle errors
    pyshell.on("error", (error) => {
      reject(error);
    });
    // End the Python process
    pyshell.end((err) => {
      if (err) {
        reject(err);
      }
    });
  });
}
export { runModel };
