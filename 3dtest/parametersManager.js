// Define the shared object
export const parameters = {
    width :20,
    height : 10,
    depth : 5,
    thickness : 0.1,
};

// Optional function to update value
export function updateWidth(newValue) {
    parameters.width = newValue;
}