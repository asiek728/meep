// Helper function to get the name and surname of the user
export function nameToInitials(name) {
    const words = name.split(' ')
    return `${words[0][0]}${words[1][0]}`
}