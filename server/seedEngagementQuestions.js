const mongoose = require("mongoose");
const dotenv = require("dotenv");
const EngagementQuestion = require("./models/EngagementQuestion");

dotenv.config();

const questions = [
  // Aptitude Questions (13 questions)
  {
    questionText: "If a train travels 120 km in 2 hours, what is its average speed?",
    category: "aptitude",
    options: ["60 km/h", "50 km/h", "40 km/h", "30 km/h"],
    correctOption: 0,
    difficulty: "easy",
    explanation: "Average speed = Total distance / Total time = 120 km / 2 hours = 60 km/h",
  },
  {
    questionText: "What is 15% of 240?",
    category: "aptitude",
    options: ["32", "36", "40", "44"],
    correctOption: 1,
    difficulty: "easy",
    explanation: "15% of 240 = (15/100) × 240 = 0.15 × 240 = 36",
  },
  {
    questionText: "A number is increased by 20% and then decreased by 20%. What is the net change?",
    category: "aptitude",
    options: ["No change", "4% increase", "4% decrease", "20% decrease"],
    correctOption: 2,
    difficulty: "medium",
    explanation: "Let the number be 100. After 20% increase: 120. After 20% decrease: 120 × 0.8 = 96. Net change = 4% decrease",
  },
  {
    questionText: "The ratio of two numbers is 3:4. If their sum is 84, what is the larger number?",
    category: "aptitude",
    options: ["36", "42", "48", "52"],
    correctOption: 2,
    difficulty: "medium",
    explanation: "Let the numbers be 3x and 4x. 3x + 4x = 84, so x = 12. Larger number = 4x = 48",
  },
  {
    questionText: "In how many ways can 5 people sit in 5 chairs?",
    category: "aptitude",
    options: ["60", "120", "240", "720"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "This is 5! (5 factorial) = 5 × 4 × 3 × 2 × 1 = 120",
  },
  {
    questionText: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
    category: "aptitude",
    options: ["40", "42", "44", "46"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, so next is 6×7=42",
  },
  {
    questionText: "A shopkeeper marks an item 30% above cost price and gives a discount of 10%. What is his profit percentage?",
    category: "aptitude",
    options: ["15%", "17%", "19%", "21%"],
    correctOption: 1,
    difficulty: "hard",
    explanation: "Let CP = 100. Marked price = 130. Selling price = 130 × 0.9 = 117. Profit = 17%",
  },
  {
    questionText: "If the simple interest on a sum of money is 1/4 of the principal and the number of years is equal to the rate of interest, find the rate.",
    category: "aptitude",
    options: ["2%", "5%", "10%", "15%"],
    correctOption: 1,
    difficulty: "hard",
    explanation: "SI = P/4, and since T = R, we have (P × R × R)/100 = P/4, so R² = 25, R = 5%",
  },
  {
    questionText: "What is the square root of 1764?",
    category: "aptitude",
    options: ["38", "40", "42", "44"],
    correctOption: 2,
    difficulty: "easy",
    explanation: "42 × 42 = 1764, so √1764 = 42",
  },
  {
    questionText: "A container has 20 liters of milk. 4 liters are removed and replaced with water. This process is repeated once more. How much milk remains?",
    category: "aptitude",
    options: ["12.8 liters", "13.2 liters", "14.4 liters", "15.6 liters"],
    correctOption: 0,
    difficulty: "hard",
    explanation: "After first replacement: (20-4)/20 × 20 = 16L milk. After second: 16/20 × 16 = 12.8L milk",
  },
  {
    questionText: "What is the LCM of 12, 18, and 24?",
    category: "aptitude",
    options: ["48", "72", "96", "144"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "LCM of 12, 18, 24. Prime factors: 12=2²×3, 18=2×3², 24=2³×3. LCM = 2³×3² = 72",
  },
  {
    questionText: "If x + 1/x = 5, what is x² + 1/x²?",
    category: "aptitude",
    options: ["23", "25", "27", "29"],
    correctOption: 0,
    difficulty: "hard",
    explanation: "(x + 1/x)² = x² + 2 + 1/x². So x² + 1/x² = (x + 1/x)² - 2 = 25 - 2 = 23",
  },
  {
    questionText: "What is 25% of 1/4 of 320?",
    category: "aptitude",
    options: ["16", "20", "24", "28"],
    correctOption: 1,
    difficulty: "easy",
    explanation: "1/4 of 320 = 80. 25% of 80 = 0.25 × 80 = 20",
  },

  // Reasoning Questions (13 questions)
  {
    questionText: "If all roses are flowers, and some flowers fade quickly, which statement must be true?",
    category: "reasoning",
    options: [
      "All roses fade quickly",
      "Some roses may fade quickly",
      "No roses fade quickly",
      "Roses are not flowers",
    ],
    correctOption: 1,
    difficulty: "medium",
    explanation: "Since some flowers fade quickly and all roses are flowers, some roses may fade quickly (but we cannot say all roses do).",
  },
  {
    questionText: "Complete the series: ACE, BDF, CEG, ?",
    category: "reasoning",
    options: ["DFH", "DEH", "DFI", "CEH"],
    correctOption: 0,
    difficulty: "easy",
    explanation: "Each term increments by 1: A→B→C, C→D→E, E→F→G, so next is D→E→F, F→G→H, G→H→I = DFH",
  },
  {
    questionText: "In a certain code, 'MATHEMATICS' is written as 'NXUIFNBUJDT'. How is 'COMPUTER' written?",
    category: "reasoning",
    options: ["DPNQVUFS", "DQOQWUFU", "DPNQVUFQ", "DONQVUFS"],
    correctOption: 0,
    difficulty: "hard",
    explanation: "Each letter is shifted forward by 1 position: C→D, O→P, M→N, P→Q, U→V, T→U, E→F, R→S",
  },
  {
    questionText: "If RED is coded as 6720, how is GREEN coded?",
    category: "reasoning",
    options: ["1677209", "172209", "167209", "1722090"],
    correctOption: 2,
    difficulty: "hard",
    explanation: "R=18, E=5, D=4. Pattern: R=1×8, E=5, D=2×0. So G=7, R=1×8, E=5, E=5, N=14=1×4. Green = 167209",
  },
  {
    questionText: "Pointing to a photograph, a man said, 'I have no brother or sister, but that man's father is my father's son.' Who is in the photograph?",
    category: "reasoning",
    options: ["His son", "His father", "Himself", "His grandfather"],
    correctOption: 0,
    difficulty: "medium",
    explanation: "'My father's son' is the man himself (he has no brothers). So 'that man's father is me' means the man in the photo is his son.",
  },
  {
    questionText: "Find the odd one out: Circle, Square, Triangle, Cube",
    category: "reasoning",
    options: ["Circle", "Square", "Triangle", "Cube"],
    correctOption: 3,
    difficulty: "easy",
    explanation: "Circle, Square, and Triangle are 2D shapes, while Cube is a 3D shape.",
  },
  {
    questionText: "If MORNING is coded as EVMGNMG, how is EVENING coded?",
    category: "reasoning",
    options: ["VFMFMNF", "VFNGMNF", "VFNGNMF", "VFMFNGM"],
    correctOption: 1,
    difficulty: "hard",
    explanation: "Each letter is replaced with the letter 2 positions before in alphabet: E→C, V→T, E→C, N→L, I→G, N→L, G→E",
  },
  {
    questionText: "In a row of 40 students, A is 15th from the left. What is A's position from the right?",
    category: "reasoning",
    options: ["24th", "25th", "26th", "27th"],
    correctOption: 2,
    difficulty: "easy",
    explanation: "Position from right = Total - Position from left + 1 = 40 - 15 + 1 = 26th",
  },
  {
    questionText: "Choose the word that does NOT belong: Apple, Banana, Carrot, Orange",
    category: "reasoning",
    options: ["Apple", "Banana", "Carrot", "Orange"],
    correctOption: 2,
    difficulty: "easy",
    explanation: "Apple, Banana, and Orange are fruits, while Carrot is a vegetable.",
  },
  {
    questionText: "If 'PENCIL' is coded as 'QFOEJM', how is 'PAPER' coded?",
    category: "reasoning",
    options: ["QBQFS", "QBRFS", "QBQFT", "QBRFT"],
    correctOption: 0,
    difficulty: "medium",
    explanation: "Each letter is shifted forward by 1: P→Q, A→B, P→Q, E→F, R→S. So PAPER → QBQFS",
  },
  {
    questionText: "What comes next in the series: 2, 5, 10, 17, 26, ?",
    category: "reasoning",
    options: ["35", "37", "39", "41"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "The pattern is n² + 1: 1²+1=2, 2²+1=5, 3²+1=10, 4²+1=17, 5²+1=26, so 6²+1=37",
  },
  {
    questionText: "All birds can fly. Penguins are birds. Which conclusion is valid?",
    category: "reasoning",
    options: [
      "Penguins can fly",
      "Penguins cannot fly",
      "Some birds cannot fly",
      "None of the above",
    ],
    correctOption: 2,
    difficulty: "medium",
    explanation: "If all birds can fly but penguins (which are birds) cannot fly, then the premise is false, so some birds cannot fly.",
  },
  {
    questionText: "Find the missing number: 3, 7, 15, 31, ?",
    category: "reasoning",
    options: ["47", "63", "55", "59"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "The pattern is: each number = previous × 2 + 1. So 31 × 2 + 1 = 63",
  },

  // Coding Questions (14 questions)
  {
    questionText: "What is the output of: print(2 ** 3) in Python?",
    category: "coding",
    options: ["6", "8", "9", "5"],
    correctOption: 1,
    difficulty: "easy",
    explanation: "** is the exponentiation operator in Python. 2 ** 3 means 2 raised to the power of 3, which equals 8.",
  },
  {
    questionText: "What does the following JavaScript code return? [1, 2, 3].map(x => x * 2)",
    category: "coding",
    options: ["[2, 4, 6]", "[1, 2, 3]", "[3, 6, 9]", "Error"],
    correctOption: 0,
    difficulty: "easy",
    explanation: "The map() function applies the arrow function (x => x * 2) to each element, multiplying by 2, resulting in [2, 4, 6].",
  },
  {
    questionText: "What is the time complexity of binary search on a sorted array?",
    category: "coding",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "Binary search eliminates half of the search space in each iteration, resulting in O(log n) time complexity.",
  },
  {
    questionText: "What will this Python code print? x = [1, 2, 3]; x.append([4, 5]); print(len(x))",
    category: "coding",
    options: ["3", "4", "5", "7"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "append() adds the entire list [4, 5] as a single element, so x becomes [1, 2, 3, [4, 5]], making len(x) = 4.",
  },
  {
    questionText: "What is the output of: console.log(typeof null) in JavaScript?",
    category: "coding",
    options: ["'null'", "'object'", "'undefined'", "'boolean'"],
    correctOption: 1,
    difficulty: "medium",
    explanation: "In JavaScript, typeof null returns 'object', which is a known bug/quirk in the language that has been kept for backwards compatibility.",
  },
  {
    questionText: "Which data structure uses LIFO (Last In First Out) principle?",
    category: "coding",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctOption: 1,
    difficulty: "easy",
    explanation: "A Stack follows LIFO principle where the last element added is the first one to be removed.",
  },
  {
    questionText: "What is the output of this Java code? String s1 = 'Hello'; String s2 = 'Hello'; System.out.println(s1 == s2);",
    category: "coding",
    options: ["true", "false", "Compile error", "Runtime error"],
    correctOption: 0,
    difficulty: "hard",
    explanation: "String literals in Java are interned, so s1 and s2 reference the same object in the string pool, making == true.",
  },
  {
    questionText: "What does this SQL query do? SELECT COUNT(*) FROM users WHERE age > 18",
    category: "coding",
    options: [
      "Counts all users",
      "Counts users older than 18",
      "Counts users aged 18",
      "Returns an error",
    ],
    correctOption: 1,
    difficulty: "easy",
    explanation: "The WHERE clause filters rows where age > 18, and COUNT(*) counts those filtered rows.",
  },
  {
    questionText: "What is the output of: print('Hello' + 3) in Python 3?",
    category: "coding",
    options: ["'Hello3'", "'HelloHelloHello'", "TypeError", "'Hello 3'"],
    correctOption: 2,
    difficulty: "medium",
    explanation: "In Python 3, you cannot concatenate a string and an integer directly. This raises a TypeError.",
  },
  {
    questionText: "What is the purpose of the 'git clone' command?",
    category: "coding",
    options: [
      "Create a new branch",
      "Copy a repository to local machine",
      "Commit changes",
      "Merge branches",
    ],
    correctOption: 1,
    difficulty: "easy",
    explanation: "git clone is used to copy an existing Git repository from a remote location to your local machine.",
  },
  {
    questionText: "What is the time complexity of accessing an element by index in an array?",
    category: "coding",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctOption: 2,
    difficulty: "easy",
    explanation: "Arrays allow direct access to elements by index using pointer arithmetic, making it O(1) constant time operation.",
  },
  {
    questionText: "What does this CSS selector target? .container > .child",
    category: "coding",
    options: [
      "All .child inside .container",
      "Direct child .child of .container",
      "All .container and .child",
      "Only .container",
    ],
    correctOption: 1,
    difficulty: "medium",
    explanation: "The > selector is the child combinator, which selects only direct children, not all descendants.",
  },
  {
    questionText: "What is the output of: [x for x in range(5) if x % 2 == 0] in Python?",
    category: "coding",
    options: ["[0, 2, 4]", "[1, 3]", "[0, 1, 2, 3, 4]", "[2, 4]"],
    correctOption: 0,
    difficulty: "medium",
    explanation: "This list comprehension filters range(5) = [0,1,2,3,4] to include only even numbers: [0, 2, 4].",
  },
  {
    questionText: "Which HTTP method is typically used to retrieve data from a server?",
    category: "coding",
    options: ["POST", "GET", "PUT", "DELETE"],
    correctOption: 1,
    difficulty: "easy",
    explanation: "GET is the HTTP method used to retrieve or fetch data from a server. It should not modify server state.",
  },
];

async function seedEngagementQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing questions
    await EngagementQuestion.deleteMany({});
    console.log("✅ Cleared existing engagement questions");

    // Insert questions
    await EngagementQuestion.insertMany(questions);
    console.log(`✅ Seeded ${questions.length} engagement questions successfully`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding engagement questions:", error);
    process.exit(1);
  }
}

seedEngagementQuestions();

