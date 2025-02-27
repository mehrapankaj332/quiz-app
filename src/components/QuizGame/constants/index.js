export const quizData = {
    "easy": [
      {
        "type": "multiple-choice",
        "question": "Which of the following is a JavaScript framework?",
        "options": ["React", "CSS", "HTML", "Python"],
        "correctAnswer": "React"
      },
      {
        "type": "true-false",
        "question": "JavaScript is a compiled language.",
        "correctAnswer": "false"
      },
      {
        "type": "text-input",
        "question": "What does DOM stand for?",
        "correctAnswer": "Document Object Model"
      }
    ],
    "medium": [
      {
        "type": "multiple-choice",
        "question": "Which company developed JavaScript?",
        "options": ["Microsoft", "Netscape", "Google", "Oracle"],
        "correctAnswer": "Netscape"
      },
      {
        "type": "true-false",
        "question": "JavaScript supports automatic memory management.",
        "correctAnswer": "true"
      },
      {
        "type": "text-input",
        "question": "What keyword is used to define a constant in JavaScript?",
        "correctAnswer": "const"
      }
    ],
    "hard": [
      {
        "type": "multiple-choice",
        "question": "Which method is used to add an element to the end of an array in JavaScript?",
        "options": ["push()", "pop()", "shift()", "unshift()"],
        "correctAnswer": "push()"
      },
      {
        "type": "true-false",
        "question": "JavaScript is single-threaded.",
        "correctAnswer": "true"
      },
      {
        "type": "text-input",
        "question": "What is the result of 0.1 + 0.2 === 0.3 in JavaScript?",
        "correctAnswer": "false"
      }
    ]
  };
  
  export const POINTS_PER_LEVEL = {
    easy: 10,
    medium: 20,
    hard: 30
  };
  
  export const REQUIRED_CORRECT_ANSWERS = 2;