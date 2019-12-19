export function getErrorMessage(error: Error) {
    return error.name.replace('Error ', '');
}
