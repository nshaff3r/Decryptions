from random import choice

puzzle = list('THE WORD "CRYPTOGRAM" IS A CRYPTOGRAM FOR FORTY-EIGHT OTHER ENGLISH WORDS.')
alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
unchanged = [True] * len(puzzle)
changed = {}

for i, (letter, condition) in enumerate(zip(puzzle, unchanged)):
    if letter.isalpha() and condition:
        if letter not in changed:
            new = choice(alphabet)
            while new == letter: 
                new = choice(alphabet)
            changed[letter] = new
            alphabet.remove(new)
        puzzle[i] = changed[letter]

print("".join(puzzle))