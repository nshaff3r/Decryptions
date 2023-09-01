from random import choice

solution = "THE USE OF CRYPTOGRAMS FOR ENTERTAINMENT DATES BACK TO THE MIDDLE AGES, WHERE MONKS PLAYED THEM TO PASS TIME."
alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
changed = []
for letter in solution:
    if letter not in changed and letter.isalpha():
        new = choice(alpha)
        solution = solution.replace(letter, new)
        alpha.remove(new)
        changed.append(letter)

print(solution)