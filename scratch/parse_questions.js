const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../Документы/Тест вопросы 100.txt');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const questions = [];
let currentQuestion = null;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  // Match question start: "1. ", "100. "
  const questionMatch = line.match(/^(\d+)\.\s*(.*)$/);
  if (questionMatch) {
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    currentQuestion = {
      id: parseInt(questionMatch[1], 10),
      text: questionMatch[2].trim(),
      options: []
    };
    continue;
  }

  // Match option: "А) ", "A) ", "Б) "
  // Options can be Cyrillic or Latin letters
  const optionMatch = line.match(/^([А-Яа-яA-Za-z])\)\s*(.*)$/);
  if (optionMatch && currentQuestion) {
    currentQuestion.options.push({
      letter: optionMatch[1].toUpperCase(),
      text: optionMatch[2].trim()
    });
  } else if (currentQuestion) {
    // Append line to question text or last option if it doesn't match standard prefixes
    if (currentQuestion.options.length > 0) {
      currentQuestion.options[currentQuestion.options.length - 1].text += ' ' + line;
    } else {
      currentQuestion.text += ' ' + line;
    }
  }
}

if (currentQuestion) {
  questions.push(currentQuestion);
}

console.log(`Parsed ${questions.length} questions.`);

// Let's print the first 3 to verify
console.log('First 3 questions:', JSON.stringify(questions.slice(0, 3), null, 2));

// Save to assets/js/testing-questions.js as a global variable
const jsContent = `// Automatically parsed questions
window.TEST_QUESTIONS = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../assets/js/testing-questions.js'), jsContent, 'utf8');
console.log('Saved to assets/js/testing-questions.js');
