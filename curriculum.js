// JavaQuest Curriculum — curriculum.js
// 24 Modules (B1-B8, I1-I8, A1-A8) grounded in "Core Java" (Cay Horstmann) and "Effective Java" (Joshua Bloch)
// Enhanced with rich tech photography, real developer portraits, and interactive visualizers

const CURRICULUM = [
  {
    "id": "b1",
    "code": "B1",
    "level": "beginner",
    "title": "How Java Runs & Orientation",
    "subtitle": "Source code, bytecode, JVM, JIT, JDK, and your first Java program",
    "biome": "Sunrise Plains",
    "estimatedMinutes": 90,
    "learningObjectives": [
      "Explain source (.java) vs bytecode (.class)",
      "Describe JVM, ClassLoader, and HotSpot JIT compiler roles",
      "Construct a valid class and main method in Java 21",
      "Diagnose and fix basic syntax and compilation errors"
    ],
    "prerequisites": [],
    "lessons": [
      {
        "id": "b1_l1",
        "title": "Source Code to Bytecode",
        "xp": 25,
        "estimatedMinutes": 12,
        "story": "Welcome to the Sunrise Plains! Java takes your human-readable .java source code and forges it into portable .class bytecode blocks that run anywhere.",
        "slides": [
          {
            "title": "Write Once, Run Anywhere",
            "type": "intro",
            "content": "Java compiles into **bytecode** for the Java Virtual Machine (JVM). Bytecode runs identically on Windows, Mac, Linux, and Cloud.",
            "code": "// 1. Greeting.java\n// 2. javac Greeting.java -> Greeting.class\n// 3. java Greeting"
          },
          {
            "title": "The Main Method",
            "type": "code",
            "content": "Execution begins at the standard entry point: `public static void main(String[] args)`.",
            "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Overworld!\");\n    }\n}"
          }
        ],
        "underTheHood": "javac transforms AST nodes into bytecode instructions. The JVM executes these with verification and HotSpot JIT compilation.",
        "commonMistakes": [
          {
            "mistake": "Class name does not match file name",
            "error": "class Main is public, should be declared in Main.java",
            "fix": "Class name must match file name exactly."
          }
        ],
        "checkpoint": [
          {
            "question": "What tool compiles Java code into bytecode?",
            "options": [
              "java",
              "javac",
              "javap",
              "jvm"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Print `Hello, Overworld!` followed by a newline.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Print message\n    }\n}",
          "hints": [
            "Use System.out.println()",
            "Wrap text in double quotes",
            "End statement with a semicolon ;"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Overworld!\");\n    }\n}",
          "tests": [
            {
              "name": "Print Hello Overworld",
              "stdin": "",
              "expected": "Hello, Overworld!"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 1",
            "verify": false
          },
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Chapter 2",
            "verify": false
          }
        ]
      },
      {
        "id": "b1_l2",
        "title": "Printing & Output Formatting",
        "xp": 25,
        "estimatedMinutes": 15,
        "story": "Signs and chat messages share discoveries in the Overworld. Use print and println to communicate output cleanly.",
        "slides": [
          {
            "title": "print vs println",
            "type": "code",
            "content": "`System.out.print` stays on the same line, while `System.out.println` advances to the next line.",
            "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.print(\"Level \");\n        System.out.println(1);\n    }\n}"
          }
        ],
        "underTheHood": "System.out is a static PrintStream. In production environments, standard output is buffered for throughput.",
        "commonMistakes": [
          {
            "mistake": "Single quotes around multi-character text",
            "error": "unclosed character literal",
            "fix": "Use double quotes for Strings."
          }
        ],
        "checkpoint": [
          {
            "question": "Which method starts a new line after printing?",
            "options": [
              "System.out.print()",
              "System.out.println()",
              "System.out.write()"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Output `Quest: Active` on the first line, and `Player: Steve` on the second line.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Print two lines\n    }\n}",
          "hints": [
            "Call System.out.println twice",
            "First line: Quest: Active",
            "Second line: Player: Steve"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Quest: Active\");\n        System.out.println(\"Player: Steve\");\n    }\n}",
          "tests": [
            {
              "name": "Prints two lines",
              "stdin": "",
              "expected": "Quest: Active\nPlayer: Steve"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Chapter 3",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "What file contains Java bytecode?",
        "options": [
          ".java",
          ".class",
          ".jar",
          ".jvm"
        ],
        "answer": 1,
        "explanation": ".class files contain compiled bytecode."
      },
      {
        "type": "output",
        "question": "What is output by System.out.print(\"X\"); System.out.println(\"Y\");?",
        "options": [
          "X\\nY",
          "XY",
          "Y\\nX",
          "X Y"
        ],
        "answer": 1,
        "explanation": "print does not add a newline."
      }
    ]
  },
  {
    "id": "b2",
    "code": "B2",
    "level": "beginner",
    "title": "Variables, Data Types & Input",
    "subtitle": "Primitives, reference types, Scanner, and type casting",
    "biome": "Village Market",
    "estimatedMinutes": 100,
    "learningObjectives": [
      "Choose and use all 8 primitive types properly",
      "Declare and initialize variables with static typing",
      "Read terminal inputs using java.util.Scanner",
      "Perform safe numeric conversions and type casting"
    ],
    "prerequisites": [
      "b1"
    ],
    "lessons": [
      {
        "id": "b2_l1",
        "title": "Primitive Types & Memory Sizes",
        "xp": 25,
        "estimatedMinutes": 14,
        "story": "At the Village Market, commodities are sorted by size. Java provides 8 fixed primitive types so memory layout is always predictable.",
        "slides": [
          {
            "title": "The 8 Primitives",
            "type": "intro",
            "content": "`byte` (8b), `short` (16b), `int` (32b), `long` (64b), `float` (32b), `double` (64b), `char` (16b), `boolean` (1b).",
            "code": "int emeralds = 16;\ndouble balance = 99.50;\nboolean isOpen = true;\nchar grade = 'A';"
          }
        ],
        "underTheHood": "Primitive sizes in Java are defined identically across every OS by the JLS §4.2, guaranteeing portability.",
        "commonMistakes": [
          {
            "mistake": "Missing L on long literal",
            "error": "integer number too large",
            "fix": "Add L to literals over 2.14B: long x = 3000000000L;"
          }
        ],
        "checkpoint": [
          {
            "question": "What is the default integer type in Java?",
            "options": [
              "byte",
              "short",
              "int",
              "long"
            ],
            "answer": 2
          }
        ],
        "exercise": {
          "instructions": "Declare an `int` named `gold` with value `50`, and print: `Gold: 50`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Declare gold and print\n    }\n}",
          "hints": [
            "int gold = 50;",
            "System.out.println(\"Gold: \" + gold);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int gold = 50;\n        System.out.println(\"Gold: \" + gold);\n    }\n}",
          "tests": [
            {
              "name": "Prints gold",
              "stdin": "",
              "expected": "Gold: 50"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification (Java SE 21)",
            "location": "Section 4.2",
            "verify": false
          }
        ]
      },
      {
        "id": "b2_l2",
        "title": "Reading Input with Scanner",
        "xp": 30,
        "estimatedMinutes": 16,
        "story": "Villagers listen and respond! Connect to standard input via java.util.Scanner to make your code interactive.",
        "slides": [
          {
            "title": "Reading Standard Input",
            "type": "code",
            "content": "Use `Scanner sc = new Scanner(System.in);` and `sc.nextLine()` to read user input.",
            "code": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String item = sc.nextLine();\n        System.out.println(\"Item: \" + item);\n        sc.close();\n    }\n}"
          }
        ],
        "underTheHood": "Scanner parses tokens using regular expressions over the underlying System.in stream.",
        "commonMistakes": [
          {
            "mistake": "Missing import java.util.Scanner",
            "error": "cannot find symbol: class Scanner",
            "fix": "Add import java.util.Scanner; at line 1."
          }
        ],
        "checkpoint": [
          {
            "question": "Which method reads an entire text line?",
            "options": [
              "next()",
              "nextLine()",
              "read()",
              "nextString()"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Read an integer from input and print `Double: ` followed by double its value.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Read int and print double\n    }\n}",
          "hints": [
            "int n = sc.nextInt();",
            "System.out.println(\"Double: \" + (n * 2));"
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(\"Double: \" + (n * 2));\n        sc.close();\n    }\n}",
          "tests": [
            {
              "name": "Double 10",
              "stdin": "10\n",
              "expected": "Double: 20"
            },
            {
              "name": "Double 7",
              "stdin": "7\n",
              "expected": "Double: 14"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Chapter 3.7",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Which type represents a single Unicode character?",
        "options": [
          "String",
          "char",
          "byte",
          "Character"
        ],
        "answer": 1,
        "explanation": "char is the 16-bit Unicode primitive."
      }
    ]
  },
  {
    "id": "b3",
    "code": "B3",
    "level": "beginner",
    "title": "Operators & Expressions",
    "subtitle": "Arithmetic, modulo, compound assignments, comparisons, and boolean logic",
    "biome": "Farmland",
    "estimatedMinutes": 90,
    "learningObjectives": [
      "Apply arithmetic operators (+, -, *, /, %) with integer truncation rules",
      "Use relational operators and boolean logical operators (&&, ||, !)",
      "Explain short-circuit evaluation in boolean expressions",
      "Evaluate operator precedence and write unambiguous expressions"
    ],
    "prerequisites": [
      "b2"
    ],
    "lessons": [
      {
        "id": "b3_l1",
        "title": "Arithmetic & Modulo Operations",
        "xp": 25,
        "estimatedMinutes": 14,
        "story": "Crops grow in rows. Divide seeds and harvest yields using arithmetic and modulo remainder operations.",
        "slides": [
          {
            "title": "Arithmetic & Integer Division",
            "type": "code",
            "content": "Integer division `/` truncates decimals. Modulo `%` returns the remainder.",
            "code": "int total = 17;\nint perChest = 5;\nint chests = total / perChest; // 3\nint leftover = total % perChest; // 2"
          }
        ],
        "underTheHood": "Integer division in Java rounds toward zero. For floating point, division by zero produces Infinity rather than throwing ArithmeticException.",
        "commonMistakes": [
          {
            "mistake": "Expecting decimal result from integer division",
            "error": "e.g. 5 / 2 yields 2, not 2.5",
            "fix": "Cast one operand to double: (double) 5 / 2"
          }
        ],
        "checkpoint": [
          {
            "question": "What is 14 % 4 in Java?",
            "options": [
              "3",
              "2",
              "3.5",
              "0"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Given `int total = 29;` and `int group = 6;`, print `Quotient: X, Remainder: Y`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int total = 29, group = 6;\n        // TODO: Print quotient and remainder\n    }\n}",
          "hints": [
            "int q = total / group;",
            "int r = total % group;",
            "System.out.println(\"Quotient: \" + q + \", Remainder: \" + r);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int total = 29, group = 6;\n        System.out.println(\"Quotient: \" + (total / group) + \", Remainder: \" + (total % group));\n    }\n}",
          "tests": [
            {
              "name": "Computes div and mod",
              "stdin": "",
              "expected": "Quotient: 4, Remainder: 5"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Section 3.5: Operators",
            "verify": false
          }
        ]
      },
      {
        "id": "b3_l2",
        "title": "Boolean Logic & Short-Circuiting",
        "xp": 25,
        "estimatedMinutes": 14,
        "story": "Redstone logic gates require precise signals. Combine conditions with AND (&&), OR (||), and NOT (!).",
        "slides": [
          {
            "title": "Short-Circuit Evaluation",
            "type": "code",
            "content": "In `A && B`, if A is false, B is never evaluated. In `A || B`, if A is true, B is skipped.",
            "code": "boolean hasPickaxe = true;\nboolean hasTorch = false;\nboolean canMine = hasPickaxe && (hasTorch || true);"
          }
        ],
        "underTheHood": "Short-circuiting prevents NullPointerException: `str != null && str.length() > 0` safely guards against null access.",
        "commonMistakes": [
          {
            "mistake": "Using single & instead of &&",
            "error": "Bitwise evaluation instead of short-circuit",
            "fix": "Always use && and || for boolean logic."
          }
        ],
        "checkpoint": [
          {
            "question": "If x = false, does (x && doSomething()) execute doSomething()?",
            "options": [
              "Yes",
              "No"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Given `int health = 80;` and `boolean hasPotion = true;`, print `Safe: true` if health > 50 and hasPotion is true.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int health = 80;\n        boolean hasPotion = true;\n        // TODO: Evaluate and print\n    }\n}",
          "hints": [
            "boolean isSafe = health > 50 && hasPotion;",
            "System.out.println(\"Safe: \" + isSafe);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int health = 80;\n        boolean hasPotion = true;\n        System.out.println(\"Safe: \" + (health > 50 && hasPotion));\n    }\n}",
          "tests": [
            {
              "name": "Evaluates logic",
              "stdin": "",
              "expected": "Safe: true"
            }
          ]
        },
        "references": [
          {
            "source": "Introduction to Java Programming, 12th ed.",
            "location": "Chapter 3",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "output",
        "question": "What is printed by: int a = 5; System.out.println(++a * 2);?",
        "options": [
          "10",
          "12",
          "11",
          "Compilation error"
        ],
        "answer": 1,
        "explanation": "++a increments to 6 before multiplication, so 6 * 2 = 12."
      }
    ]
  },
  {
    "id": "b4",
    "code": "B4",
    "level": "beginner",
    "title": "Decisions & Loops",
    "subtitle": "if/else branching, switch expressions, while, for, and loop control",
    "biome": "Redstone Lab",
    "estimatedMinutes": 110,
    "learningObjectives": [
      "Write multi-branch decisions using if, else if, else and switch expressions",
      "Execute repetitive tasks using while, do-while, and for loops",
      "Control loop flow using break and continue",
      "Avoid off-by-one errors and infinite loop conditions"
    ],
    "prerequisites": [
      "b3"
    ],
    "lessons": [
      {
        "id": "b4_l1",
        "title": "Branching with if/else & Switch",
        "xp": 25,
        "estimatedMinutes": 15,
        "story": "In the Redstone Lab, pressure plates direct minecarts along different tracks. Use if/else and modern switch expressions to steer execution.",
        "slides": [
          {
            "title": "Modern Switch Expressions (Java 14+)",
            "type": "code",
            "content": "Modern switch uses the arrow `->` syntax and does not suffer from accidental fallthrough.",
            "code": "int day = 2;\nString name = switch (day) {\n    case 1 -> \"Monday\";\n    case 2 -> \"Tuesday\";\n    default -> \"Weekend\";\n};\nSystem.out.println(name);"
          }
        ],
        "underTheHood": "Modern switch expressions are translated by javac into tableswitch or lookupswitch bytecode instructions with exhaustiveness checking.",
        "commonMistakes": [
          {
            "mistake": "Missing break in traditional switch",
            "error": "Fallthrough to subsequent cases",
            "fix": "Use modern switch -> syntax or include break;"
          }
        ],
        "checkpoint": [
          {
            "question": "What keyword provides the fallback case in a switch statement?",
            "options": [
              "else",
              "default",
              "finally",
              "catch"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Given `int score = 85;`, print `Pass` if score >= 60, otherwise print `Fail`.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        // TODO: Check score\n    }\n}",
          "hints": [
            "if (score >= 60) { System.out.println(\"Pass\"); } else { System.out.println(\"Fail\"); }"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 60) {\n            System.out.println(\"Pass\");\n        } else {\n            System.out.println(\"Fail\");\n        }\n    }\n}",
          "tests": [
            {
              "name": "Prints Pass",
              "stdin": "",
              "expected": "Pass"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Section 3.8: Control Flow",
            "verify": false
          }
        ]
      },
      {
        "id": "b4_l2",
        "title": "Repetition with for & while Loops",
        "xp": 30,
        "estimatedMinutes": 16,
        "story": "Redstone repeater clocks tick continuously. Automate repetitive tasks using while and for loops.",
        "slides": [
          {
            "title": "The for Loop",
            "type": "code",
            "content": "A for loop bundles initialization, condition check, and increment into one header line.",
            "code": "for (int i = 1; i <= 5; i++) {\n    System.out.print(i + \" \");\n}"
          }
        ],
        "underTheHood": "A for loop compiles into an initialization, conditional branch (if_icmpge), loop body bytecode, increment (iinc), and unconditional jump (goto).",
        "commonMistakes": [
          {
            "mistake": "Off-by-one loop boundary (<= vs <)",
            "error": "Executes one time too many or few",
            "fix": "Check boundary conditions carefully."
          }
        ],
        "checkpoint": [
          {
            "question": "How many times does for (int i = 0; i < 3; i++) run?",
            "options": [
              "2",
              "3",
              "4",
              "Infinite"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Use a loop to print numbers from 1 to 4 on separate lines.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Print 1 to 4\n    }\n}",
          "hints": [
            "for (int i = 1; i <= 4; i++)",
            "System.out.println(i);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 4; i++) {\n            System.out.println(i);\n        }\n    }\n}",
          "tests": [
            {
              "name": "Prints 1 to 4",
              "stdin": "",
              "expected": "1\n2\n3\n4"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 2",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "output",
        "question": "What is printed by: int count = 0; while (count < 3) count++; System.out.println(count);?",
        "options": [
          "2",
          "3",
          "4",
          "0"
        ],
        "answer": 1,
        "explanation": "Loop runs for count = 0, 1, 2, exits when count becomes 3."
      }
    ]
  },
  {
    "id": "b5",
    "code": "B5",
    "level": "beginner",
    "title": "Methods & Scope",
    "subtitle": "Parameters, return values, pass-by-value, method overloading, and call stack",
    "biome": "Crafting Workshop",
    "estimatedMinutes": 100,
    "learningObjectives": [
      "Deconstruct methods into return type, name, and parameter list",
      "Explain pass-by-value semantics for primitives and object references",
      "Implement method overloading based on distinct parameter signatures",
      "Trace call stack execution and understand local variable scope"
    ],
    "prerequisites": [
      "b4"
    ],
    "lessons": [
      {
        "id": "b5_l1",
        "title": "Defining & Calling Methods",
        "xp": 25,
        "estimatedMinutes": 15,
        "story": "In the Crafting Workshop, recipes transform inputs into tools. Methods encapsulate algorithms so you can reuse them anywhere.",
        "slides": [
          {
            "title": "Method Anatomy",
            "type": "code",
            "content": "A method specifies its return type, name, and typed parameters.",
            "code": "public static int add(int a, int b) {\n    return a + b;\n}\n\npublic static void main(String[] args) {\n    int sum = add(10, 25);\n    System.out.println(\"Sum: \" + sum);\n}"
          }
        ],
        "underTheHood": "Calling a method pushes a new Stack Frame containing local variables and operand stack onto the Java Thread Stack.",
        "commonMistakes": [
          {
            "mistake": "Missing return statement in non-void method",
            "error": "missing return statement",
            "fix": "Every code path in a non-void method must return a value."
          }
        ],
        "checkpoint": [
          {
            "question": "What return type indicates a method does not return any value?",
            "options": [
              "null",
              "void",
              "empty",
              "none"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Implement a static method `square(int x)` that returns `x * x`. In `main`, print `square(7)`.",
          "starterCode": "public class Main {\n    // TODO: Define square method\n    public static void main(String[] args) {\n        // TODO: Call and print square(7)\n    }\n}",
          "hints": [
            "public static int square(int x) { return x * x; }",
            "System.out.println(square(7));"
          ],
          "solution": "public class Main {\n    public static int square(int x) {\n        return x * x;\n    }\n    public static void main(String[] args) {\n        System.out.println(square(7));\n    }\n}",
          "tests": [
            {
              "name": "Squares 7",
              "stdin": "",
              "expected": "49"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Chapter 4",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Is Java pass-by-value or pass-by-reference?",
        "options": [
          "Pass-by-value exclusively",
          "Pass-by-reference exclusively",
          "Pass-by-value for primitives, pass-by-reference for objects",
          "Depends on JVM flags"
        ],
        "answer": 0,
        "explanation": "Java is strictly pass-by-value. For objects, the value of the reference (pointer) is copied."
      }
    ]
  },
  {
    "id": "b6",
    "code": "B6",
    "level": "beginner",
    "title": "Arrays & Strings",
    "subtitle": "1D/2D arrays, enhanced for-each, String immutability, and StringBuilder",
    "biome": "Chest Vault",
    "estimatedMinutes": 105,
    "learningObjectives": [
      "Allocate and manipulate fixed-size arrays with 0-based indexing",
      "Iterate over sequences cleanly using the enhanced for-each loop",
      "Explain String immutability and the String Constant Pool",
      "Use StringBuilder for efficient multi-step string assembly"
    ],
    "prerequisites": [
      "b5"
    ],
    "lessons": [
      {
        "id": "b6_l1",
        "title": "1D Arrays & The for-each Loop",
        "xp": 25,
        "estimatedMinutes": 15,
        "story": "The Chest Vault organizes items in rows of fixed inventory slots. Arrays store ordered elements of the same type.",
        "slides": [
          {
            "title": "Declaring and Accessing Arrays",
            "type": "code",
            "content": "Arrays have a fixed `.length` property and are 0-indexed.",
            "code": "int[] gems = {10, 25, 40};\nfor (int g : gems) {\n    System.out.println(g);\n}"
          }
        ],
        "underTheHood": "Arrays are objects stored on the Heap. The JVM performs bounds checking (aaload/aastore) and throws ArrayIndexOutOfBoundsException on violation.",
        "commonMistakes": [
          {
            "mistake": "Accessing array[length] instead of array[length - 1]",
            "error": "ArrayIndexOutOfBoundsException",
            "fix": "Array indexes range from 0 to length - 1."
          }
        ],
        "checkpoint": [
          {
            "question": "What property returns the number of elements in an array?",
            "options": [
              "length()",
              "size()",
              "length",
              "count"
            ],
            "answer": 2
          }
        ],
        "exercise": {
          "instructions": "Given `int[] nums = {4, 8, 12};`, calculate and print the sum of its elements.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {4, 8, 12};\n        // TODO: Compute and print sum\n    }\n}",
          "hints": [
            "int sum = 0;",
            "for (int n : nums) sum += n;",
            "System.out.println(sum);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {4, 8, 12};\n        int sum = 0;\n        for (int n : nums) sum += n;\n        System.out.println(sum);\n    }\n}",
          "tests": [
            {
              "name": "Calculates sum",
              "stdin": "",
              "expected": "24"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Section 3.10: Arrays",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Why are Strings immutable in Java?",
        "options": [
          "Security, caching in String Pool, and thread-safety",
          "Faster garbage collection only",
          "To prevent inheritance",
          "Hardware constraint"
        ],
        "answer": 0,
        "explanation": "Immutability enables String Constant Pool caching, thread-safety, and secure hashing."
      }
    ]
  },
  {
    "id": "b7",
    "code": "B7",
    "level": "beginner",
    "title": "Classes & Objects (OOP Foundations)",
    "subtitle": "State, behavior, constructors, encapsulation, this keyword, and static members",
    "biome": "Blueprint Forge",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Model real-world entities using classes (state + behavior)",
      "Construct objects with parameterized constructors and the this reference",
      "Enforce encapsulation using private fields and public getters/setters",
      "Differentiate between instance members and class-level static members"
    ],
    "prerequisites": [
      "b6"
    ],
    "lessons": [
      {
        "id": "b7_l1",
        "title": "Classes, Fields & Constructors",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "At the Blueprint Forge, master builders create spawn blueprints. A class is a blueprint; an object is an active entity instantiated into the world.",
        "slides": [
          {
            "title": "Class Definition & Constructor",
            "type": "code",
            "content": "Constructors initialize state when creating a `new` instance.",
            "code": "class Player {\n    private String name;\n    private int level;\n    public Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n    public String getName() { return name; }\n}"
          }
        ],
        "underTheHood": "The `new` operator allocates memory on the Heap, zeroes fields to defaults, invokes the constructor `<init>`, and returns the memory reference.",
        "commonMistakes": [
          {
            "mistake": "Omitting this when parameter matches field name",
            "error": "Field remains uninitialized or default value",
            "fix": "Use this.field = param to disambiguate."
          }
        ],
        "checkpoint": [
          {
            "question": "What keyword allocates an object instance on the Heap?",
            "options": [
              "create",
              "new",
              "malloc",
              "spawn"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Create an `Item` class with `String name` and `int power`. In `main`, create `new Item(\"Sword\", 50)` and print `Sword power: 50`.",
          "starterCode": "class Item {\n    // TODO: Define fields, constructor, and getters\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Instantiate and print\n    }\n}",
          "hints": [
            "class Item { String name; int power; Item(String n, int p) { name = n; power = p; } }",
            "System.out.println(item.name + \" power: \" + item.power);"
          ],
          "solution": "class Item {\n    String name;\n    int power;\n    public Item(String name, int power) {\n        this.name = name;\n        this.power = power;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Item item = new Item(\"Sword\", 50);\n        System.out.println(item.name + \" power: \" + item.power);\n    }\n}",
          "tests": [
            {
              "name": "Instantiates Item",
              "stdin": "",
              "expected": "Sword power: 50"
            }
          ]
        },
        "references": [
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 16: In public classes, use accessor methods",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 4",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "What is encapsulation in OOP?",
        "options": [
          "Hiding internal state behind public methods",
          "Inheriting from multiple parents",
          "Compiling code into bytecode",
          "Allocating memory on the stack"
        ],
        "answer": 0,
        "explanation": "Encapsulation bundles data and methods while restricting direct access to fields."
      }
    ]
  },
  {
    "id": "b8",
    "code": "B8",
    "level": "beginner",
    "title": "Exceptions & Collections Intro",
    "subtitle": "try-catch-finally, checked vs unchecked, ArrayList<E>, and HashMap<K,V>",
    "biome": "Creeper Cave",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Handle runtime errors safely using try-catch-finally blocks",
      "Distinguish between checked exceptions and unchecked RuntimeExceptions",
      "Use java.util.ArrayList<E> for dynamic, resizable collections",
      "Store and retrieve key-value pairs using java.util.HashMap<K, V>"
    ],
    "prerequisites": [
      "b7"
    ],
    "lessons": [
      {
        "id": "b8_l1",
        "title": "Handling Exceptions with try-catch",
        "xp": 30,
        "estimatedMinutes": 16,
        "story": "In the Creeper Cave, unexpected surprises happen. Wrap hazardous operations in try-catch blocks to prevent your application from crashing.",
        "slides": [
          {
            "title": "The try-catch Mechanism",
            "type": "code",
            "content": "Catch specific exceptions to handle errors gracefully.",
            "code": "try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println(\"Handled division by zero!\");\n}"
          }
        ],
        "underTheHood": "When an exception is thrown, the JVM creates an Exception Table entry and unwinds stack frames until a matching catch block is located.",
        "commonMistakes": [
          {
            "mistake": "Empty catch block (swallowing exceptions)",
            "error": "Silent failure in production",
            "fix": "Log or handle the exception appropriately (Effective Java Item 77)."
          }
        ],
        "checkpoint": [
          {
            "question": "Which block always runs regardless of whether an exception was thrown?",
            "options": [
              "try",
              "catch",
              "finally",
              "else"
            ],
            "answer": 2
          }
        ],
        "exercise": {
          "instructions": "Use a try-catch block to catch an `ArithmeticException` when dividing `10 / 0` and print `Caught error!`.",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: try-catch block\n    }\n}",
          "hints": [
            "try { int x = 10 / 0; } catch (ArithmeticException e) { System.out.println(\"Caught error!\"); }"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        try {\n            int x = 10 / 0;\n        } catch (ArithmeticException e) {\n            System.out.println(\"Caught error!\");\n        }\n    }\n}",
          "tests": [
            {
              "name": "Catches exception",
              "stdin": "",
              "expected": "Caught error!"
            }
          ]
        },
        "references": [
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Chapter 10: Exceptions",
            "verify": false
          }
        ]
      },
      {
        "id": "b8_l2",
        "title": "Dynamic Lists with ArrayList<E>",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "Standard chests have fixed slots, but a magical Ender pouch expands on demand! ArrayList<E> grows dynamically as you add items.",
        "slides": [
          {
            "title": "Using java.util.ArrayList",
            "type": "code",
            "content": "ArrayList provides dynamic resizing, `.add()`, `.get(index)`, and `.size()`.",
            "code": "import java.util.ArrayList;\n\nArrayList<String> pouch = new ArrayList<>();\npouch.add(\"Torch\");\npouch.add(\"Pickaxe\");\nSystem.out.println(\"Items: \" + pouch.size());"
          }
        ],
        "underTheHood": "ArrayList wraps an internal Object[] array. When capacity is exceeded, it allocates a new array of 1.5x size and copies elements using System.arraycopy.",
        "commonMistakes": [
          {
            "mistake": "Using primitive types in generics (e.g. ArrayList<int>)",
            "error": "unexpected type: found primitive",
            "fix": "Use wrapper classes: ArrayList<Integer>"
          }
        ],
        "checkpoint": [
          {
            "question": "What method returns the number of elements in an ArrayList?",
            "options": [
              "length",
              "size()",
              "count()",
              "length()"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Create an `ArrayList<String>` named `loot`, add `\"Diamond\"` and `\"Gold\"`, and print `Loot size: 2`.",
          "starterCode": "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: ArrayList operations\n    }\n}",
          "hints": [
            "ArrayList<String> loot = new ArrayList<>();",
            "loot.add(\"Diamond\"); loot.add(\"Gold\");",
            "System.out.println(\"Loot size: \" + loot.size());"
          ],
          "solution": "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> loot = new ArrayList<>();\n        loot.add(\"Diamond\");\n        loot.add(\"Gold\");\n        System.out.println(\"Loot size: \" + loot.size());\n    }\n}",
          "tests": [
            {
              "name": "Prints loot size",
              "stdin": "",
              "expected": "Loot size: 2"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Chapter 9: Collections",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Which class implements a resizable array backed by an internal array?",
        "options": [
          "LinkedList",
          "ArrayList",
          "Vector",
          "ArrayDeque"
        ],
        "answer": 1,
        "explanation": "ArrayList is the standard resizable array implementation."
      }
    ]
  },
  {
    "id": "i1",
    "code": "I1",
    "level": "intermediate",
    "title": "OOP Beyond the Basics",
    "subtitle": "SOLID principles, composition, records and sealed classes",
    "icon": "",
    "color": "#9B59B6",
    "lessons": [
      {
        "id": "lesson-i1-1",
        "title": "SOLID & Composition",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Design Principles",
            "content": "SOLID guides robust design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Favor **composition over inheritance** for flexible architectures."
          },
          {
            "type": "visual",
            "visual": "class-diagram",
            "visualData": {
              "classes": [
                {
                  "name": "Employee",
                  "type": "abstract class",
                  "fields": [
                    "- String name",
                    "- double salary"
                  ],
                  "methods": [
                    "+ abstract calculateBonus()"
                  ]
                },
                {
                  "name": "Manager",
                  "type": "class (extends Employee)",
                  "fields": [
                    "- int teamSize"
                  ],
                  "methods": [
                    "+ calculateBonus() [Overridden]"
                  ]
                }
              ]
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Modern Java Records",
            "content": "Records (Java 16+) provide concise, immutable data carriers with auto-generated constructor, getters, equals, and hashCode.",
            "code": "public record User(String name, int age) {}\n// Usage:\nUser u = new User(\"Alice\", 25);\nSystem.out.println(u.name());"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i1-2",
        "title": "Sealed Types & Enums",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Exhaustive Hierarchies",
            "content": "`sealed` classes and interfaces restrict which classes can extend or implement them using `permits`. Enables compiler-checked pattern matching."
          },
          {
            "type": "code",
            "title": "Sealed Hierarchy",
            "content": "Example of sealed interface and permits.",
            "code": "public sealed interface Shape permits Circle, Square {}\nfinal class Circle implements Shape {}\nfinal class Square implements Shape {}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i1",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "What is the primary benefit of Java Records?",
          "options": [
            "They make programs compile faster",
            "They provide concise, immutable data carrier classes",
            "They replace all regular classes",
            "They disable garbage collection"
          ],
          "answer": 1,
          "explanation": "Records are compact syntax for immutable data holders with automatic constructors, getters, and equals/hashCode."
        },
        {
          "type": "true-false",
          "question": "Composition means a class contains an instance of another class rather than extending it.",
          "answer": true,
          "explanation": "Composition (\"has-a\" relationship) gives greater flexibility than strict class inheritance (\"is-a\")."
        },
        {
          "type": "output",
          "question": "What does record accessor method output?",
          "code": "record Point(int x, int y) {}\nPoint p = new Point(3, 7);\nSystem.out.println(p.x() + p.y());",
          "options": [
            "10",
            "37",
            "Point[x=3,y=7]",
            "Compile error"
          ],
          "answer": 0,
          "explanation": "p.x() is 3 and p.y() is 7; 3 + 7 = 10."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for OOP Beyond the Basics?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i1",
      "title": "I1: Immutable Order Record",
      "prompt": "Define a Java Record `record Order(String id, double amount, boolean isDelivered) {}`\nIn `Main`, create an order with id `\"ORD-99\"`, amount `149.50`, delivered `true`.\nPrint: `Order ORD-99: $149.5 | Delivered: true`",
      "starterCode": "// TODO 1: Define a record Order with fields: String id, double amount, boolean isDelivered\nrecord Order(String id, double amount, boolean isDelivered) {}\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO 2: Instantiate an Order with id \"ORD-99\", amount 149.50, and delivered true\n        // TODO 3: Print: Order ORD-99: $149.5 | Delivered: true\n    }\n}",
      "expectedOutput": "Order ORD-99: $149.5 | Delivered: true",
      "testCases": [
        {
          "name": "Print Record State",
          "expected": "Order ORD-99: $149.5 | Delivered: true"
        }
      ],
      "hints": [
        "Record field accessors use name() without \"get\" prefix.",
        "Use double 149.50."
      ]
    }
},
  {
    "id": "i2",
    "code": "I2",
    "level": "intermediate",
    "title": "Collections & Generics",
    "subtitle": "List, Set, Queue, Map, Iterator, Comparator and type safety",
    "icon": "",
    "color": "#3498DB",
    "lessons": [
      {
        "id": "lesson-i2-1",
        "title": "Collection Hierarchy & Sets",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Collections Framework",
            "content": "Java Collections provide standardized architecture for representing and manipulating collections of objects. `Set` models a mathematical set with **no duplicates**."
          },
          {
            "type": "visual",
            "visual": "class-diagram",
            "visualData": {
              "classes": [
                {
                  "name": "PaymentGateway",
                  "type": "interface",
                  "fields": [
                    "+ String API_VER = \"v2\""
                  ],
                  "methods": [
                    "+ void process(double amt)",
                    "+ default void refund()"
                  ]
                },
                {
                  "name": "StripeAdapter",
                  "type": "class implements PaymentGateway",
                  "fields": [],
                  "methods": [
                    "+ void process(double amt)"
                  ]
                }
              ]
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Set Uniqueness",
            "content": "HashSet vs TreeSet (sorted).",
            "code": "Set<String> set = new HashSet<>();\nset.add(\"A\");\nset.add(\"A\"); // Duplicate ignored\nSystem.out.println(set.size()); // prints 1"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i2-2",
        "title": "Generics & Type Safety",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Why Generics Matter",
            "content": "Generics (`<T>`) enable compile-time type checking, eliminating `ClassCastException` at runtime and removing the need for manual casting."
          },
          {
            "type": "code",
            "title": "Generic Method",
            "content": "Generic print method.",
            "code": "public static <T> void printItem(T item) {\n    System.out.println(\"Item: \" + item);\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i2",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "Which collection interface does not allow duplicate elements?",
          "options": [
            "List",
            "Set",
            "Map",
            "Queue"
          ],
          "answer": 1,
          "explanation": "Set models a collection of unique elements and rejects duplicates."
        },
        {
          "type": "mcq",
          "question": "What is the main purpose of generics in Java?",
          "options": [
            "To run code faster in every case",
            "To enable compile-time type safety",
            "To replace classes",
            "To create database tables"
          ],
          "answer": 1,
          "explanation": "Generics allow types to be verified by the compiler, avoiding runtime ClassCastExceptions."
        },
        {
          "type": "true-false",
          "question": "TreeSet orders its elements naturally or using a supplied Comparator.",
          "answer": true,
          "explanation": "TreeSet uses a red-black tree to keep elements sorted in natural or comparator order."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Collections & Generics?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i2",
      "title": "I2: Word Frequency Counter",
      "prompt": "Given: `String[] words = {\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"};`\nUse a `HashMap<String, Integer>` to count frequencies.\nPrint:\n`apple: 3\nbanana: 2\ncherry: 1`",
      "starterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] words = {\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"};\n        \n        // TODO 1: Create a Map<String, Integer> to count word frequencies\n        \n        // TODO 2: Iterate over words and count occurrences\n        \n        // TODO 3: Print each word and count (e.g. apple: 3, banana: 2, cherry: 1)\n    }\n}",
      "expectedOutput": "apple: 3\nbanana: 2\ncherry: 1",
      "testCases": [
        {
          "name": "Word Counts Match",
          "expected": "apple: 3\nbanana: 2\ncherry: 1"
        }
      ],
      "hints": [
        "Use LinkedHashMap to preserve insertion order.",
        "Use freq.getOrDefault(w, 0) + 1."
      ]
    }
},
  {
    "id": "i3",
    "code": "I3",
    "level": "intermediate",
    "title": "Exceptions, Files & I/O",
    "subtitle": "Try-with-resources, Path, Files, buffered streams and CSV",
    "icon": "",
    "color": "#1ABC9C",
    "lessons": [
      {
        "id": "lesson-i3-1",
        "title": "Try-With-Resources",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Automatic Resource Management",
            "content": "Any resource implementing `java.lang.AutoCloseable` can be opened in `try(...)`. Java guarantees it will be closed automatically, preventing resource leaks!"
          },
          {
            "type": "visual",
            "visual": "memory",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Try-With-Resources Syntax",
            "content": "No finally block needed for closing streams.",
            "code": "import java.io.*;\ntry (BufferedReader br = new BufferedReader(new StringReader(\"Line 1\\nLine 2\"))) {\n    System.out.println(br.readLine());\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i3-2",
        "title": "Modern Files API (java.nio.file)",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Path & Files",
            "content": "Modern Java uses `java.nio.file.Path` and `Files` class for efficient file operations, replacing older `java.io.File`."
          },
          {
            "type": "code",
            "title": "Files.readString / writeString",
            "content": "Quick reading and writing in Java 11+.",
            "code": "Path p = Path.of(\"notes.txt\");\n// Files.writeString(p, \"Java rocks!\");\n// String content = Files.readString(p);"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i3",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "Which mechanism ensures a resource is automatically closed after a try-with-resources block?",
          "options": [
            "final",
            "static",
            "Automatic resource management (AutoCloseable)",
            "synchronized"
          ],
          "answer": 2,
          "explanation": "The try-with-resources construct closes AutoCloseable resources automatically."
        },
        {
          "type": "true-false",
          "question": "Checked exceptions must be either caught or declared in the method signature with throws.",
          "answer": true,
          "explanation": "The Java compiler forces handling or declaration of checked exceptions."
        },
        {
          "type": "output",
          "question": "What does this safe parsing code output?",
          "code": "try {\n    int n = Integer.parseInt(\"abc\");\n} catch (NumberFormatException e) {\n    System.out.println(\"Invalid number\");\n}",
          "options": [
            "Invalid number",
            "abc",
            "0",
            "NullPointerException"
          ],
          "answer": 0,
          "explanation": "Integer.parseInt(\"abc\") throws NumberFormatException, caught by the catch block."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Exceptions, Files & I/O?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i3",
      "title": "I3: Safe Integer Parser",
      "prompt": "Write a static method `public static int parseSafe(String s, int fallback)`\nIf `s` is a valid integer, return it. If it throws `NumberFormatException`, return `fallback`.\nIn `main`, test with:\n`\"42\"` (fallback 0) -> print `42`\n`\"xyz\"` (fallback -1) -> print `-1`",
      "starterCode": "public class Main {\n    // TODO 1: Implement parseSafe(String s, int fallback)\n    // If s parses to integer, return it. If NumberFormatException is thrown, return fallback.\n    public static int parseSafe(String s, int fallback) {\n        // Your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        // TODO 2: Test with (\"42\", 0) -> prints 42\n        // Test with (\"xyz\", -1) -> prints -1\n    }\n}",
      "expectedOutput": "42\n-1",
      "testCases": [
        {
          "name": "Parse Valid and Fallback",
          "expected": "42\n-1"
        }
      ],
      "hints": [
        "Wrap Integer.parseInt() in try-catch.",
        "Catch NumberFormatException and return fallback."
      ]
    }
},
  {
    "id": "i4",
    "code": "I4",
    "level": "intermediate",
    "title": "Lambdas, Streams & Functional Java",
    "subtitle": "Stream pipeline: filter, map, sorted, reduce, collect and Optional",
    "icon": "",
    "color": "#2ECC71",
    "lessons": [
      {
        "id": "lesson-i4-1",
        "title": "Functional Interfaces & Lambdas",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Passing Behavior as Data",
            "content": "A functional interface has exactly **one abstract method** (e.g. `Predicate<T>`, `Function<T,R>`, `Consumer<T>`). Lambda expressions provide concise implementations."
          },
          {
            "type": "visual",
            "visual": "flowchart",
            "visualData": {
              "condition": "riskyOperation()",
              "trueBranch": "Commit Work",
              "falseBranch": "catch (IOException e)"
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Lambda Syntax",
            "content": "`parameter -> expression`",
            "code": "List<String> names = List.of(\"Java\", \"Kotlin\", \"Scala\");\nnames.forEach(n -> System.out.println(n));"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i4-2",
        "title": "The Stream API Pipeline",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Declarative Data Processing",
            "content": "Streams allow functional transformations: `source -> intermediate operations (filter, map, sorted) -> terminal operation (collect, reduce, count)`."
          },
          {
            "type": "code",
            "title": "Filter and Map",
            "content": "Stream transformation example.",
            "code": "List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);\nList<Integer> evens = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * 10)\n    .toList();\nSystem.out.println(evens); // [20, 40, 60]"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i4",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "What does Stream.filter() do in a stream pipeline?",
          "options": [
            "Transforms each element",
            "Keeps elements matching a predicate",
            "Sorts elements in memory",
            "Writes elements to disk"
          ],
          "answer": 1,
          "explanation": "Stream.filter retains only elements for which the predicate returns true."
        },
        {
          "type": "mcq",
          "question": "What is a lambda expression commonly used to provide?",
          "options": [
            "A package declaration",
            "An implementation of a functional interface",
            "A database connection",
            "A class loader"
          ],
          "answer": 1,
          "explanation": "Lambdas provide the single abstract method implementation of a functional interface."
        },
        {
          "type": "output",
          "question": "What does this stream pipeline output?",
          "code": "List<String> list = List.of(\"cat\", \"elephant\", \"dog\");\nlong count = list.stream().filter(s -> s.length() == 3).count();\nSystem.out.println(count);",
          "options": [
            "2",
            "3",
            "1",
            "0"
          ],
          "answer": 0,
          "explanation": "\"cat\" and \"dog\" have length 3, so count is 2."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Lambdas, Streams & Functional Java?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i4",
      "title": "I4: Stream Square Evens",
      "prompt": "Given: `List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);`\nUsing the Stream API:\n1. Filter only even numbers (`n % 2 == 0`)\n2. Map each even number to its square (`n * n`)\n3. Print each result on a new line\nOutput should be:\n`4\n16\n36`",
      "starterCode": "import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);\n        \n        // TODO: Use Java Stream API to:\n        // 1. Filter only even numbers (n % 2 == 0)\n        // 2. Map each even number to its square (n * n)\n        // 3. Print each result on a new line\n    }\n}",
      "expectedOutput": "4\n16\n36",
      "testCases": [
        {
          "name": "Filter and Square Evens",
          "expected": "4\n16\n36"
        }
      ],
      "hints": [
        "Use .filter(n -> n % 2 == 0)",
        "Use .map(n -> n * n)",
        "Use .forEach(System.out::println)"
      ]
    }
},
  {
    "id": "i5",
    "code": "I5",
    "level": "intermediate",
    "title": "Date/Time, Regex & Useful APIs",
    "subtitle": "java.time, LocalDate, Duration, Pattern/Matcher, BigDecimal",
    "icon": "️",
    "color": "#E67E22",
    "lessons": [
      {
        "id": "lesson-i5-1",
        "title": "Modern Date & Time (java.time)",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Goodbye Old java.util.Date",
            "content": "Modern Java includes `LocalDate`, `LocalDateTime`, `Duration`, and `Period`. They are thread-safe and immutable!"
          },
          {
            "type": "visual",
            "visual": "class-diagram",
            "visualData": {
              "classes": [
                {
                  "name": "Box<T extends Number>",
                  "type": "generic class",
                  "fields": [
                    "- T content"
                  ],
                  "methods": [
                    "+ void set(T val)",
                    "+ T get()",
                    "+ double doubleVal()"
                  ]
                }
              ]
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "LocalDate Operations",
            "content": "Date manipulation with java.time.",
            "code": "import java.time.LocalDate;\nLocalDate today = LocalDate.of(2026, 11, 4);\nLocalDate nextWeek = today.plusDays(7);\nSystem.out.println(nextWeek);"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i5-2",
        "title": "Regular Expressions & BigDecimal",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Regex & Financial Math",
            "content": "Use `Pattern` and `Matcher` for text validation. Always use **`BigDecimal`** for financial calculations to avoid floating-point inaccuracies!"
          },
          {
            "type": "code",
            "title": "BigDecimal Precision",
            "content": "Precise financial math.",
            "code": "import java.math.BigDecimal;\nBigDecimal price = new BigDecimal(\"19.99\");\nBigDecimal tax = new BigDecimal(\"1.08\");\nSystem.out.println(price.multiply(tax));"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i5",
      "xp": 60,
      "questions": [
        {
          "type": "true-false",
          "question": "Double and float primitive types should be used for precise financial and currency calculations.",
          "answer": false,
          "explanation": "Double and float have binary rounding errors. Always use BigDecimal for money."
        },
        {
          "type": "mcq",
          "question": "Which class in java.time represents a date without time or timezone?",
          "options": [
            "LocalDateTime",
            "LocalDate",
            "Instant",
            "ZonedDateTime"
          ],
          "answer": 1,
          "explanation": "LocalDate represents date only (year, month, day)."
        },
        {
          "type": "output",
          "question": "What does regex matches check?",
          "code": "String zip = \"94043\";\nSystem.out.println(zip.matches(\"\\\\d{5}\"));",
          "options": [
            "true",
            "false",
            "null",
            "Error"
          ],
          "answer": 0,
          "explanation": "\\d{5} matches exactly 5 numeric digits, so it returns true."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Date/Time, Regex & Useful APIs?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i5",
      "title": "I5: Simple Email Validator",
      "prompt": "Write a method `public static boolean isValidEmail(String email)`\nUse regex to check that email contains characters, followed by `@`, followed by domain name, a dot, and extension (e.g. `^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]+$`)\nIn main, validate `\"hero@javaquest.com\"` and `\"invalid-email\"` and print:\n`hero@javaquest.com: true\ninvalid-email: false`",
      "starterCode": "public class Main {\n    // TODO 1: Implement isValidEmail(String email) using regex\n    public static boolean isValidEmail(String email) {\n        // Your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        // TODO 2: Test \"hero@javaquest.com\" (prints true)\n        // Test \"invalid-email\" (prints false)\n    }\n}",
      "expectedOutput": "hero@javaquest.com: true\ninvalid-email: false",
      "testCases": [
        {
          "name": "Validate Valid and Invalid Emails",
          "expected": "hero@javaquest.com: true\ninvalid-email: false"
        }
      ],
      "hints": [
        "Use String.matches() with regex pattern."
      ]
    }
},
  {
    "id": "i6",
    "code": "I6",
    "level": "intermediate",
    "title": "Testing & Debugging",
    "subtitle": "JUnit 5 basics, assertions, test lifecycle and edge cases",
    "icon": "",
    "color": "#16A085",
    "lessons": [
      {
        "id": "lesson-i6-1",
        "title": "Unit Testing with JUnit 5",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Automated Testing",
            "content": "Unit tests prove individual units of code work as expected. JUnit 5 uses `@Test`, `@BeforeEach`, and assertions like `assertEquals()`."
          },
          {
            "type": "visual",
            "visual": "hashmap",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "JUnit 5 Anatomy",
            "content": "Testing expected behavior.",
            "code": "import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass CalculatorTest {\n    @Test\n    void testAdd() {\n        assertEquals(5, 2 + 3);\n    }\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i6-2",
        "title": "Debugging Techniques",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Finding Bugs Systematically",
            "content": "Learn to read stack traces from bottom to top, set conditional breakpoints in your IDE, and test boundary edge cases (0, empty, null, max)."
          },
          {
            "type": "code",
            "title": "Testing Exceptions",
            "content": "Asserting that an exception is thrown.",
            "code": "assertThrows(IllegalArgumentException.class, () -> {\n    throw new IllegalArgumentException(\"Invalid\");\n});"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i6",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "Which JUnit assertion checks that two values are equal?",
          "options": [
            "assertEquals",
            "assertThrows",
            "assertNull",
            "failOnly"
          ],
          "answer": 0,
          "explanation": "assertEquals compares expected and actual values."
        },
        {
          "type": "true-false",
          "question": "Edge cases such as 0, null, empty lists, and negative numbers should be tested.",
          "answer": true,
          "explanation": "Most production bugs happen at boundaries and edge cases."
        },
        {
          "type": "output",
          "question": "What happens in a unit test if assertEquals(5, 2 + 2) executes?",
          "options": [
            "Test fails with AssertionError",
            "Test passes",
            "Java compiler error",
            "JVM exits"
          ],
          "answer": 0,
          "explanation": "Expected was 5 but actual was 4, causing the test assertion to fail."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Testing & Debugging?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i6",
      "title": "I6: Unit Test Simulator",
      "prompt": "Write a small test runner that verifies `add(a, b)`:\nIf `add(2, 3) == 5`, print `TEST 1: PASS`\nIf `add(-1, 1) == 0`, print `TEST 2: PASS`\nIf all pass, print `ALL TESTS PASSED`",
      "starterCode": "public class Main {\n    static int add(int a, int b) { return a + b; }\n\n    public static void main(String[] args) {\n        // TODO 1: Test if add(2, 3) == 5 -> print \"TEST 1: PASS\"\n        // TODO 2: Test if add(-1, 1) == 0 -> print \"TEST 2: PASS\"\n        // TODO 3: If both pass, print \"ALL TESTS PASSED\"\n    }\n}",
      "expectedOutput": "TEST 1: PASS\nTEST 2: PASS\nALL TESTS PASSED",
      "testCases": [
        {
          "name": "Simulate Automated Tests",
          "expected": "ALL TESTS PASSED"
        }
      ],
      "hints": [
        "Check both test conditions."
      ]
    }
},
  {
    "id": "i7",
    "code": "I7",
    "level": "intermediate",
    "title": "Database Programming with JDBC",
    "subtitle": "SQL basics, PreparedStatement, ResultSet and transactions",
    "icon": "️",
    "color": "#27AE60",
    "lessons": [
      {
        "id": "lesson-i7-1",
        "title": "JDBC & PreparedStatement",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Connecting Java to Databases",
            "content": "Java Database Connectivity (JDBC) standardizes database operations. Always use **`PreparedStatement`** to bind parameters and prevent catastrophic SQL Injection!"
          },
          {
            "type": "visual",
            "visual": "stream",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Safe PreparedStatement",
            "content": "Parameter binding with placeholder `?`.",
            "code": "String sql = \"SELECT * FROM users WHERE email = ?\";\nPreparedStatement ps = conn.prepareStatement(sql);\nps.setString(1, \"alice@example.com\");\nResultSet rs = ps.executeQuery();"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i7-2",
        "title": "Transactions & ACID",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Commit & Rollback",
            "content": "Disable `conn.setAutoCommit(false)` to group multiple queries into an atomic transaction. Call `conn.commit()` on success, or `conn.rollback()` on failure."
          },
          {
            "type": "code",
            "title": "Transaction Template",
            "content": "Safe transaction handling pattern.",
            "code": "try {\n    conn.setAutoCommit(false);\n    // execute queries\n    conn.commit();\n} catch (Exception e) {\n    conn.rollback();\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i7",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "Which JDBC object is preferred for parameterised SQL queries?",
          "options": [
            "Statement only",
            "PreparedStatement",
            "ResultSet",
            "DriverManager"
          ],
          "answer": 1,
          "explanation": "PreparedStatement compiles the SQL structure separately from parameter values, eliminating SQL injection."
        },
        {
          "type": "mcq",
          "question": "Why should SQL values always be parameterised instead of string concatenated?",
          "options": [
            "To change Java syntax",
            "To reduce SQL injection risk",
            "To remove database indexes",
            "To avoid transactions"
          ],
          "answer": 1,
          "explanation": "Bound parameters ensure user input is treated strictly as data, never as executable SQL commands."
        },
        {
          "type": "true-false",
          "question": "A database transaction ensures that either all operations succeed or all are rolled back.",
          "answer": true,
          "explanation": "Atomicity in ACID transactions guarantees all-or-nothing execution."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Database Programming with JDBC?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i7",
      "title": "I7: Parameterized SQL Query Builder",
      "prompt": "Implement a helper method `public static String buildUserQuery(String table, String column)`\nIt should return: `SELECT * FROM ` + table + ` WHERE ` + column + ` = ?`\nIn main, call with `\"accounts\"` and `\"user_id\"`, and print the query string.",
      "starterCode": "public class Main {\n    // TODO 1: Implement buildUserQuery(String table, String column)\n    // Should return \"SELECT * FROM <table> WHERE <column> = ?\"\n    public static String buildUserQuery(String table, String column) {\n        // Your code here\n        return \"\";\n    }\n\n    public static void main(String[] args) {\n        // TODO 2: Call buildUserQuery(\"accounts\", \"user_id\") and print result\n    }\n}",
      "expectedOutput": "SELECT * FROM accounts WHERE user_id = ?",
      "testCases": [
        {
          "name": "Build Parameterized Query",
          "expected": "SELECT * FROM accounts WHERE user_id = ?"
        }
      ],
      "hints": [
        "Notice the question mark ? placeholder at the end."
      ]
    }
},
  {
    "id": "i8",
    "code": "I8",
    "level": "intermediate",
    "title": "Concurrency Foundations & Tooling",
    "subtitle": "Thread, Runnable, ExecutorService, Maven build tools, Git",
    "icon": "️",
    "color": "#2980B9",
    "lessons": [
      {
        "id": "lesson-i8-1",
        "title": "Threads & ExecutorService",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Asynchronous Execution",
            "content": "A Thread is an independent path of execution. Modern Java prefers `ExecutorService` (thread pools) over creating raw `new Thread()` manually."
          },
          {
            "type": "visual",
            "visual": "jvm",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "ExecutorService Pattern",
            "content": "Submitting tasks to a thread pool.",
            "code": "import java.util.concurrent.*;\nExecutorService pool = Executors.newFixedThreadPool(2);\npool.submit(() -> System.out.println(\"Running async!\"));\npool.shutdown();"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-i8-2",
        "title": "Build Tools & Git Lifecycle",
        "xp": 40,
        "slides": [
          {
            "type": "intro",
            "title": "Maven & Gradle",
            "content": "Build tools manage project dependencies, compile code, run tests, and package JARs (`mvn clean install`). Git tracks versions and enables collaboration."
          },
          {
            "type": "code",
            "title": "Maven pom.xml Dependency",
            "content": "Adding external libraries declarative.",
            "code": "<dependency>\n    <groupId>org.junit.jupiter</groupId>\n    <artifactId>junit-jupiter</artifactId>\n    <version>5.10.0</version>\n    <scope>test</scope>\n</dependency>"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-i8",
      "xp": 60,
      "questions": [
        {
          "type": "mcq",
          "question": "What does ExecutorService help manage in Java?",
          "options": [
            "HTML pages",
            "A pool or execution of asynchronous tasks",
            "SQL schemas",
            "Java imports"
          ],
          "answer": 1,
          "explanation": "ExecutorService manages task queuing and execution across worker threads."
        },
        {
          "type": "mcq",
          "question": "Which tool is commonly used to define and manage Java project builds and dependencies?",
          "options": [
            "Maven",
            "Paint",
            "Wireshark",
            "Figma"
          ],
          "answer": 0,
          "explanation": "Maven (along with Gradle) is the industry standard build and dependency manager for Java."
        },
        {
          "type": "true-false",
          "question": "A race condition occurs when concurrent operations produce unpredictable results depending on execution timing.",
          "answer": true,
          "explanation": "Unsynchronized access to shared mutable state leads to race conditions."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Concurrency Foundations & Tooling?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-i8",
      "title": "I8: Asynchronous Task Runner",
      "prompt": "Write a program using `ExecutorService` with 1 thread:\nSubmit a Runnable task that prints `Async Task Completed!`\nCall `pool.shutdown()` and `pool.awaitTermination(1, TimeUnit.SECONDS);`\nIn main after termination, print `All Done!`",
      "starterCode": "public class Main {\n    // TODO 1: Implement thread-safe Counter using synchronized or AtomicInteger\n    static class Counter {\n        private int count = 0;\n        public synchronized void increment() {\n            // Your code here\n        }\n        public synchronized int get() {\n            return count;\n        }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        Counter c = new Counter();\n        // TODO 2: Start 2 threads incrementing 500 times each, join them, and print \"Final Count: 1000\"\n    }\n}",
      "expectedOutput": "Async Task Completed!\nAll Done!",
      "testCases": [
        {
          "name": "Run Async and Complete",
          "expected": "Async Task Completed!\nAll Done!"
        }
      ],
      "hints": [
        "Submit task, shutdown pool, and await termination."
      ]
    }
},
  {
    "id": "a1",
    "code": "A1",
    "level": "advanced",
    "title": "JVM & Memory Model",
    "subtitle": "Class loading, JIT compilation, Heap, Stack, Metaspace and GC",
    "icon": "",
    "color": "#8E44AD",
    "lessons": [
      {
        "id": "lesson-a1-1",
        "title": "JVM Memory Architecture",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Inside the JVM",
            "content": "JVM memory is divided into: **Heap** (objects & instances), **Stack** (thread execution & local frames), and **Metaspace** (class metadata). Objects allocated at runtime live on the Heap."
          },
          {
            "type": "visual",
            "visual": "jvm",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Understanding Garbage Collection",
            "content": "Garbage collectors (G1, ZGC) reclaim unreachable objects on the heap automatically.",
            "code": "// Objects with no live references become eligible for GC:\nObject obj = new Object();\nobj = null; // eligible for GC"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a1-2",
        "title": "JIT Compilation & Bytecode",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "HotSpot & JIT",
            "content": "The **Just-In-Time (JIT)** compiler monitors execution (\"hot spots\") and compiles frequently executed bytecode directly into native machine code for maximum performance."
          },
          {
            "type": "code",
            "title": "Inspecting Bytecode with javap",
            "content": "Run `javap -c Main` in terminal to view the bytecode instructions generated by javac.",
            "code": "// Bytecode instructions: aload_0, invokespecial, getstatic, etc."
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a1",
      "xp": 75,
      "questions": [
        {
          "type": "mcq",
          "question": "Which JVM memory area is primarily used for objects allocated at runtime?",
          "options": [
            "Heap",
            "Java source folder",
            "Classpath text file",
            "CPU register file"
          ],
          "answer": 0,
          "explanation": "Objects are allocated on the Heap, where their lifecycle is managed by garbage collection."
        },
        {
          "type": "mcq",
          "question": "What does the JIT (Just-In-Time) compiler do in the JVM?",
          "options": [
            "Converts bytecode to native machine code for hot code paths",
            "Writes Java source files",
            "Creates SQL indexes",
            "Replaces garbage collection"
          ],
          "answer": 0,
          "explanation": "The JIT compiles frequently executed bytecode directly into native machine instructions at runtime."
        },
        {
          "type": "true-false",
          "question": "Local primitive variables inside a method are stored in stack memory frames.",
          "answer": true,
          "explanation": "Local primitive variables and method call states reside on the thread stack."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for JVM & Memory Model?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a1",
      "title": "A1: Runtime Memory Inspector",
      "prompt": "Write a program that uses `Runtime.getRuntime()` to query the JVM:\n1. Check `Runtime.getRuntime().totalMemory() > 0`\n2. Check `Runtime.getRuntime().freeMemory() > 0`\n3. Print: `JVM Memory: ACTIVE`",
      "starterCode": "public class Main {\n    // Sealed hierarchy:\n    // TODO 1: Make Payment sealed permitting CreditCard, Crypto\n    sealed interface Payment permits CreditCard, Crypto {}\n    record CreditCard(String cardNum) implements Payment {}\n    record Crypto(String wallet) implements Payment {}\n\n    // TODO 2: Use pattern matching switch on payment\n    public static String processPayment(Payment p) {\n        // Return \"Paid via Card: ...\" or \"Paid via Crypto: ...\"\n        return \"\";\n    }\n\n    public static void main(String[] args) {\n        // TODO 3: Test with CreditCard(\"****1234\") and print result\n    }\n}",
      "expectedOutput": "JVM Memory: ACTIVE",
      "testCases": [
        {
          "name": "Inspect JVM Runtime",
          "expected": "JVM Memory: ACTIVE"
        }
      ],
      "hints": [
        "Use Runtime.getRuntime().totalMemory()."
      ]
    }
},
  {
    "id": "a2",
    "code": "A2",
    "level": "advanced",
    "title": "Advanced Concurrency",
    "subtitle": "Java Memory Model, happens-before, locks, atomics and virtual threads",
    "icon": "",
    "color": "#D35400",
    "lessons": [
      {
        "id": "lesson-a2-1",
        "title": "Java Memory Model & Happens-Before",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "The JMM Contract",
            "content": "The **Java Memory Model (JMM)** defines how threads interact through memory. The **happens-before** relationship guarantees ordering and visibility of memory writes across threads."
          },
          {
            "type": "visual",
            "visual": "thread",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Volatile & Atomics",
            "content": "`volatile` guarantees read/write visibility. Atomics (like `AtomicInteger`) guarantee lock-free atomic operations.",
            "code": "import java.util.concurrent.atomic.AtomicInteger;\nAtomicInteger counter = new AtomicInteger(0);\ncounter.incrementAndGet(); // thread-safe without synchronized"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a2-2",
        "title": "Virtual Threads (Java 21+)",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Project Loom & Virtual Threads",
            "content": "Virtual threads are lightweight threads managed by the JVM rather than the OS. You can spawn millions of virtual threads with near-zero overhead!"
          },
          {
            "type": "code",
            "title": "Launching Virtual Threads",
            "content": "Using Thread.ofVirtual() in Java 21.",
            "code": "Thread.ofVirtual().start(() -> {\n    System.out.println(\"Running on a lightweight virtual thread!\");\n});"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a2",
      "xp": 75,
      "questions": [
        {
          "type": "mcq",
          "question": "What is a race condition?",
          "options": [
            "A compiler warning",
            "A result that depends on unpredictable timing of concurrent operations",
            "A database backup",
            "A type of loop"
          ],
          "answer": 1,
          "explanation": "Race conditions occur when multiple threads access shared state without synchronization, yielding timing-dependent bugs."
        },
        {
          "type": "mcq",
          "question": "What does the happens-before relationship help establish in the JMM?",
          "options": [
            "A guaranteed ordering and visibility relationship between actions",
            "A faster network connection",
            "A class inheritance tree",
            "A database schema"
          ],
          "answer": 0,
          "explanation": "The JMM uses happens-before to guarantee that memory writes by one thread are visible to another."
        },
        {
          "type": "true-false",
          "question": "Virtual threads introduced in Java 21 have a 1:1 mapping to operating system kernel threads.",
          "answer": false,
          "explanation": "Virtual threads are M:N user-mode threads managed by the JVM, multiplexed over a small pool of carrier OS threads."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Advanced Concurrency?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a2",
      "title": "A2: Lock-Free Atomic Counter",
      "prompt": "Use `AtomicInteger` to increment a counter 1000 times across 2 parallel tasks in `CompletableFuture`.\nThen print: `Atomic Count: 1000`",
      "starterCode": "import java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // TODO 1: Use ExecutorService to run a task on a background or virtual thread\n        // Print \"Virtual Thread Task Executed!\"\n    }\n}",
      "expectedOutput": "Atomic Count: 1000",
      "testCases": [
        {
          "name": "Atomic Counter Sums to 1000",
          "expected": "Atomic Count: 1000"
        }
      ],
      "hints": [
        "Use AtomicInteger.incrementAndGet()."
      ]
    }
},
  {
    "id": "a3",
    "code": "A3",
    "level": "advanced",
    "title": "Advanced Language Features",
    "subtitle": "Generics in depth, type erasure, annotations, reflection, pattern matching",
    "icon": "",
    "color": "#9B59B6",
    "lessons": [
      {
        "id": "lesson-a3-1",
        "title": "Pattern Matching & Modern Switch",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Type Patterns in Switch",
            "content": "Modern Java lets you switch directly on object types with pattern matching, casting automatically!"
          },
          {
            "type": "visual",
            "visual": "thread",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Pattern Matching Example",
            "content": "Clean polymorphic handling without instanceof chains.",
            "code": "Object obj = \"Hello Java 21\";\nif (obj instanceof String s) {\n    System.out.println(s.toUpperCase());\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a3-2",
        "title": "Annotations & Type Erasure",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Type Erasure",
            "content": "Java generics exist at compile-time for type safety, but the compiler erases generic type parameters in bytecode (replacing them with `Object` or bounds) for backward compatibility."
          },
          {
            "type": "code",
            "title": "Custom Annotation",
            "content": "Defining annotations with retention policy.",
            "code": "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\npublic @interface Endpoint {\n    String path();\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a3",
      "xp": 75,
      "questions": [
        {
          "type": "true-false",
          "question": "At runtime, List<String> and List<Integer> have their generic type parameters erased by the compiler.",
          "answer": true,
          "explanation": "Type erasure removes generic arguments at compile time for backward compatibility."
        },
        {
          "type": "output",
          "question": "What does pattern matching instanceof do?",
          "code": "Object val = 100;\nif (val instanceof Integer i) {\n    System.out.println(i + 25);\n}",
          "options": [
            "125",
            "10025",
            "Compile error",
            "ClassCastException"
          ],
          "answer": 0,
          "explanation": "Pattern matching automatically checks type and binds variable i as Integer: 100 + 25 = 125."
        },
        {
          "type": "mcq",
          "question": "Which annotation retention policy keeps the annotation available for runtime reflection?",
          "options": [
            "SOURCE",
            "CLASS",
            "RUNTIME",
            "SYSTEM"
          ],
          "answer": 2,
          "explanation": "RetentionPolicy.RUNTIME keeps annotations in the compiled class file and accessible via reflection."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Advanced Language Features?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a3",
      "title": "A3: Pattern Matching Evaluator",
      "prompt": "Write a static method `public static String describe(Object obj)` that uses pattern matching:\n- If `obj instanceof String s` -> return `\"String: \" + s.toUpperCase()`\n- If `obj instanceof Integer i` -> return `\"Integer: \" + (i * 2)`\n- Else -> return `\"Unknown\"`\nIn main, print `describe(\"java\")` and `describe(50)`:\n`String: JAVA\nInteger: 100`",
      "starterCode": "public class Main {\n    // TODO 1: Implement describe(Object obj) using pattern matching switch:\n    // - Integer i when i > 100 -> \"Large Integer: \" + i\n    // - Integer i -> \"Small Integer: \" + i\n    // - String s -> \"String of length \" + s.length()\n    // - default -> \"Unknown\"\n    public static String describe(Object obj) {\n        // Your code here\n        return \"\";\n    }\n\n    public static void main(String[] args) {\n        // TODO 2: Test with 150, \"JavaQuest\", and 50 and print results\n    }\n}",
      "expectedOutput": "String: JAVA\nInteger: 100",
      "testCases": [
        {
          "name": "Evaluate Pattern Matching Types",
          "expected": "String: JAVA\nInteger: 100"
        }
      ],
      "hints": [
        "Use pattern matching instanceof (obj instanceof String s)."
      ]
    }
},
  {
    "id": "a4",
    "code": "A4",
    "level": "advanced",
    "title": "Design & Architecture",
    "subtitle": "Builder, Factory, Strategy, Observer and Clean Architecture",
    "icon": "️",
    "color": "#16A085",
    "lessons": [
      {
        "id": "lesson-a4-1",
        "title": "Creational Patterns: Builder & Factory",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "The Builder Pattern",
            "content": "Solves the \"telescoping constructor\" anti-pattern when objects have many optional parameters. Produces readable, immutable objects step-by-step."
          },
          {
            "type": "visual",
            "visual": "class-diagram",
            "visualData": {
              "classes": [
                {
                  "name": "ServiceProxy",
                  "type": "dynamic proxy",
                  "fields": [
                    "- InvocationHandler h"
                  ],
                  "methods": [
                    "+ Object invoke(proxy, method, args)"
                  ]
                }
              ]
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Builder Pattern",
            "content": "Fluent method chaining pattern.",
            "code": "User u = new User.Builder(\"Alex\")\n    .email(\"alex@code.com\")\n    .role(\"ADMIN\")\n    .build();"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a4-2",
        "title": "Behavioral Patterns: Strategy & Observer",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Strategy & Clean Architecture",
            "content": "The **Strategy Pattern** defines a family of interchangeable algorithms (e.g. payment processors). Hexagonal architecture decouples core business logic from frameworks and databases."
          },
          {
            "type": "code",
            "title": "Strategy with Functional Interface",
            "content": "In modern Java, Strategy is simply a lambda or method reference!",
            "code": "Function<Double, Double> discountStrategy = price -> price * 0.9;"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a4",
      "xp": 75,
      "questions": [
        {
          "type": "mcq",
          "question": "Which design pattern is best suited for constructing complex objects with many optional parameters?",
          "options": [
            "Singleton",
            "Builder",
            "Adapter",
            "Proxy"
          ],
          "answer": 1,
          "explanation": "The Builder pattern allows step-by-step object construction with readable fluent methods."
        },
        {
          "type": "true-false",
          "question": "In Hexagonal Architecture, core business domain logic depends directly on database drivers and web frameworks.",
          "answer": false,
          "explanation": "Hexagonal architecture inverts dependencies: core domain is isolated and has zero dependencies on external frameworks."
        },
        {
          "type": "output",
          "question": "What does fluent method chaining in a builder return?",
          "options": [
            "The builder instance itself (this)",
            "void",
            "null",
            "A new JVM thread"
          ],
          "answer": 0,
          "explanation": "Builder methods return this to allow chaining: .setA().setB().build()."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Design & Architecture?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a4",
      "title": "A4: Fluent Builder Pattern",
      "prompt": "Implement a `HttpRequest` class with a static `Builder`:\nFields: `url`, `method` (defaults to \"GET\"), `timeoutMs` (defaults to 3000).\nInclude fluent methods: `.url(...)`, `.method(...)`, `.timeout(...)`, `.build()`\nIn main, construct and print:\n`HttpRequest[url=https://api.javaquest.com, method=POST, timeoutMs=5000]`",
      "starterCode": "class HttpRequest {\n    final String url;\n    final String method;\n    final int timeoutMs;\n\n    private HttpRequest(Builder b) {\n        this.url = b.url;\n        this.method = b.method;\n        this.timeoutMs = b.timeoutMs;\n    }\n\n    // TODO 1: Implement Builder class with fluent methods .url(), .method(), .timeout(), and .build()\n    public static class Builder {\n        String url;\n        String method = \"GET\";\n        int timeoutMs = 3000;\n\n        public Builder url(String u) {\n            // Your code here\n            return this;\n        }\n        public Builder method(String m) {\n            // Your code here\n            return this;\n        }\n        public Builder timeout(int t) {\n            // Your code here\n            return this;\n        }\n        public HttpRequest build() {\n            // Your code here\n            return new HttpRequest(this);\n        }\n    }\n\n    public String toString() {\n        return \"HttpRequest[url=\" + url + \", method=\" + method + \", timeoutMs=\" + timeoutMs + \"]\";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO 2: Build HttpRequest with url \"https://api.javaquest.com\", method \"POST\", timeout 5000, and print it\n    }\n}",
      "expectedOutput": "HttpRequest[url=https://api.javaquest.com, method=POST, timeoutMs=5000]",
      "testCases": [
        {
          "name": "Build Request Object",
          "expected": "HttpRequest[url=https://api.javaquest.com, method=POST, timeoutMs=5000]"
        }
      ],
      "hints": [
        "Each builder method sets field and returns this.",
        "build() instantiates HttpRequest."
      ]
    }
},
  {
    "id": "a5",
    "code": "A5",
    "level": "advanced",
    "title": "Networking, Security & Reliability",
    "subtitle": "HTTP/REST, password hashing, TLS, timeouts and idempotency",
    "icon": "",
    "color": "#C0392B",
    "lessons": [
      {
        "id": "lesson-a5-1",
        "title": "Application Security & Secrets",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Defensive Engineering",
            "content": "Never store plaintext passwords! Always use salted, adaptive hashing algorithms (Argon2, BCrypt). Never hardcode API secrets in source control."
          },
          {
            "type": "visual",
            "visual": "class-diagram",
            "visualData": {
              "classes": [
                {
                  "name": "HttpRequest",
                  "type": "class (Builder Pattern)",
                  "fields": [
                    "- String url",
                    "- String method",
                    "- Map headers"
                  ],
                  "methods": [
                    "+ static class Builder",
                    "+ Builder header(k, v)",
                    "+ HttpRequest build()"
                  ]
                }
              ]
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Java 11+ HttpClient",
            "content": "Modern non-blocking HTTP client.",
            "code": "HttpClient client = HttpClient.newHttpClient();\nHttpRequest req = HttpRequest.newBuilder()\n    .uri(URI.create(\"https://api.example.com\"))\n    .GET()\n    .build();"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a5-2",
        "title": "Reliability: Idempotency & Retries",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Idempotency in Distributed Systems",
            "content": "An operation is **idempotent** if applying it multiple times produces the exact same state as applying it once (e.g. HTTP GET, PUT, DELETE). Critical for retry resilience."
          },
          {
            "type": "code",
            "title": "Exponential Backoff Pattern",
            "content": "Retrying transient errors with increasing delay.",
            "code": "// waitTime = baseDelay * (2 ^ attemptCount)"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a5",
      "xp": 75,
      "questions": [
        {
          "type": "mcq",
          "question": "Which practice is safest for storing user passwords in a database?",
          "options": [
            "Store plaintext",
            "Encrypt with a reversible key only",
            "Use a dedicated password-hashing algorithm with salt",
            "Base64 encode"
          ],
          "answer": 2,
          "explanation": "Passwords should be stored using salted, adaptive one-way hashes (e.g. BCrypt, PBKDF2, Argon2)."
        },
        {
          "type": "mcq",
          "question": "What is idempotency in an API operation?",
          "options": [
            "Repeating the same request has the same intended effect as doing it once",
            "Every request creates a new resource",
            "The request has no response",
            "The endpoint never fails"
          ],
          "answer": 0,
          "explanation": "Idempotent requests can be safely repeated without creating unintended duplicate state."
        },
        {
          "type": "true-false",
          "question": "HTTPS encrypts data in transit between client and server using TLS.",
          "answer": true,
          "explanation": "TLS guarantees confidentiality and integrity of transmitted data over the network."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Networking, Security & Reliability?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a5",
      "title": "A5: Exponential Backoff Calculator",
      "prompt": "Implement a helper `public static int getBackoffDelay(int attempt, int baseMs, int maxMs)`\nFormula: `int delay = baseMs * (1 << (attempt - 1));` capped at `maxMs`.\nIn main, print delays for attempts 1, 2, 3 with base 100ms and max 1000ms:\n`Attempt 1: 100ms\nAttempt 2: 200ms\nAttempt 3: 400ms`",
      "starterCode": "public class Main {\n    // TODO 1: Implement getBackoffDelay(int attempt, int baseMs, int maxMs)\n    // Formula: baseMs * (1 << (attempt - 1)), capped at maxMs\n    public static int getBackoffDelay(int attempt, int baseMs, int maxMs) {\n        // Your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        // TODO 2: Print backoff delays for attempts 1, 2, 3 with base 100 and max 1000:\n        // Attempt 1: 100ms\n        // Attempt 2: 200ms\n        // Attempt 3: 400ms\n    }\n}",
      "expectedOutput": "Attempt 1: 100ms\nAttempt 2: 200ms\nAttempt 3: 400ms",
      "testCases": [
        {
          "name": "Compute Exponential Backoff",
          "expected": "Attempt 1: 100ms\nAttempt 2: 200ms\nAttempt 3: 400ms"
        }
      ],
      "hints": [
        "Use Math.min(delay, maxMs) to prevent unbounded backoff."
      ]
    }
},
  {
    "id": "a6",
    "code": "A6",
    "level": "advanced",
    "title": "Spring Boot & Persistence",
    "subtitle": "Spring container, dependency injection, REST controllers, JPA and transactions",
    "icon": "",
    "color": "#27AE60",
    "lessons": [
      {
        "id": "lesson-a6-1",
        "title": "Spring Inversion of Control & DI",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "The Spring Ecosystem",
            "content": "Spring Boot is the standard enterprise framework for Java. The **Spring Container** creates and injects dependencies (`@Service`, `@Repository`, `@RestController`), decoupling components."
          },
          {
            "type": "visual",
            "visual": "flowchart",
            "visualData": {
              "condition": "connection.commit()",
              "trueBranch": "Transaction Committed",
              "falseBranch": "connection.rollback()"
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Spring REST Controller",
            "content": "Clean declarative endpoints.",
            "code": "@RestController\n@RequestMapping(\"/api/tasks\")\npublic class TaskController {\n    @GetMapping\n    public List<Task> getTasks() { return taskService.findAll(); }\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a6-2",
        "title": "Spring Data JPA & Transactions",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Data Persistence",
            "content": "Spring Data JPA manages database mapping with `@Entity` and repositories. `@Transactional` wraps method execution in an atomic database transaction."
          },
          {
            "type": "code",
            "title": "Repository Interface",
            "content": "Automatic SQL generation from method names.",
            "code": "public interface UserRepository extends JpaRepository<User, UUID> {\n    Optional<User> findByEmail(String email);\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a6",
      "xp": 75,
      "questions": [
        {
          "type": "mcq",
          "question": "Which Spring concept supplies an object with its dependencies rather than letting it construct them?",
          "options": [
            "Dependency injection",
            "Bytecode weaving only",
            "Garbage collection",
            "String interning"
          ],
          "answer": 0,
          "explanation": "Dependency injection provides collaborators to an object, promoting modularity and testability."
        },
        {
          "type": "mcq",
          "question": "What is the primary purpose of a database transaction in Spring?",
          "options": [
            "To group operations with defined commit/rollback behaviour",
            "To format Java code",
            "To compile classes",
            "To compress log files"
          ],
          "answer": 0,
          "explanation": "Transactions ensure atomicity: either all operations commit, or they rollback on error."
        },
        {
          "type": "true-false",
          "question": "Spring Data JPA automatically implements common CRUD operations without writing manual boilerplate SQL.",
          "answer": true,
          "explanation": "JpaRepository generates save, findById, findAll, delete implementations automatically."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Spring Boot & Persistence?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a6",
      "title": "A6: Simulated DI Container",
      "prompt": "Implement a tiny Dependency Injection container simulation:\n`interface MessageService { String getMessage(); }`\n`class EmailService implements MessageService { public String getMessage() { return \"Spring DI Ready\"; } }`\n`class NotificationClient { private final MessageService svc; public NotificationClient(MessageService s) { this.svc = s; } public void send() { System.out.println(svc.getMessage()); } }`\nIn main, inject EmailService and call `send()`.",
      "starterCode": "interface MessageService { String getMessage(); }\n\n// TODO 1: Implement EmailService returning \"Spring DI Ready\"\nclass EmailService implements MessageService {\n    public String getMessage() {\n        return \"\";\n    }\n}\n\n// TODO 2: Implement NotificationClient with constructor injection\nclass NotificationClient {\n    private final MessageService svc;\n    public NotificationClient(MessageService s) {\n        this.svc = s;\n    }\n    public void send() {\n        // Print svc.getMessage()\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO 3: Wire EmailService into NotificationClient and call send()\n    }\n}",
      "expectedOutput": "Spring DI Ready",
      "testCases": [
        {
          "name": "Simulate Dependency Injection",
          "expected": "Spring DI Ready"
        }
      ],
      "hints": [
        "Pass EmailService into the NotificationClient constructor."
      ]
    }
},
  {
    "id": "a7",
    "code": "A7",
    "level": "advanced",
    "title": "Performance & Observability",
    "subtitle": "Profiling, CPU/allocation bottlenecks, structured logging, metrics and tracing",
    "icon": "",
    "color": "#2C3E50",
    "lessons": [
      {
        "id": "lesson-a7-1",
        "title": "Profiling & Performance Bottlenecks",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Measure Before Optimizing",
            "content": "Never guess bottlenecks! Use profilers (Async-Profiler, JProfiler, VisualVM) to measure CPU usage, heap allocations, and lock contention under realistic loads."
          },
          {
            "type": "visual",
            "visual": "jvm",
            "visualData": null,
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Benchmarking with JMH",
            "content": "Java Microbenchmark Harness prevents JIT dead-code elimination artifacts.",
            "code": "@Benchmark\npublic void measurePerformance() {\n    // benchmarked code\n}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a7-2",
        "title": "Observability: The Three Pillars",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Logs, Metrics, Traces",
            "content": "**Logs** (discrete events), **Metrics** (aggregates like CPU, req/sec), and **Distributed Traces** (following a request across microservices) enable production diagnosis."
          },
          {
            "type": "code",
            "title": "Structured JSON Logging",
            "content": "Machine-parseable logging output.",
            "code": "// {\"timestamp\":\"...\",\"level\":\"INFO\",\"traceId\":\"...\",\"msg\":\"Order placed\"}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a7",
      "xp": 75,
      "questions": [
        {
          "type": "mcq",
          "question": "Why profile an application before attempting to optimize it?",
          "options": [
            "To identify measured bottlenecks rather than guessing",
            "To increase code length",
            "To avoid tests",
            "To remove all abstractions"
          ],
          "answer": 0,
          "explanation": "Profiling reveals actual hot spots in CPU, memory, and I/O so optimizations target real bottlenecks."
        },
        {
          "type": "mcq",
          "question": "What is the purpose of observability signals such as logs, metrics and traces?",
          "options": [
            "To understand system behaviour and diagnose issues in production",
            "To replace application security",
            "To compile code",
            "To eliminate database transactions"
          ],
          "answer": 0,
          "explanation": "Observability provides insight into internal state and system health across components."
        },
        {
          "type": "true-false",
          "question": "Premature optimization without profiling often adds unnecessary complexity without improving real performance.",
          "answer": true,
          "explanation": "\"Premature optimization is the root of all evil\" — Donald Knuth."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Performance & Observability?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a7",
      "title": "A7: Simple LRU Cache Simulation",
      "prompt": "Implement a cache using `LinkedHashMap<String, String>` configured for access order:\n`LinkedHashMap<String, String> cache = new LinkedHashMap<>(4, 0.75f, true)`\nAdd keys \"A\", \"B\", \"C\". Access \"A\" with `cache.get(\"A\")`.\nPrint cache keys: `[B, C, A]` (notice \"A\" moved to the end as most recently used!).",
      "starterCode": "import java.util.LinkedHashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO 1: Create LinkedHashMap<String, String> with access-order set to true\n        // TODO 2: Put \"A\", \"B\", \"C\"\n        // TODO 3: Access \"A\" to move it to the end\n        // TODO 4: Print cache.keySet() -> [B, C, A]\n    }\n}",
      "expectedOutput": "[B, C, A]",
      "testCases": [
        {
          "name": "Access Order LRU Ordering",
          "expected": "[B, C, A]"
        }
      ],
      "hints": [
        "The third boolean argument `true` in LinkedHashMap constructor specifies access-order."
      ]
    }
},
  {
    "id": "a8",
    "code": "A8",
    "level": "advanced",
    "title": "Deployment & Engineering Workflow",
    "subtitle": "Packaging, Docker fundamentals, CI/CD pipelines, production readiness and monitoring",
    "icon": "",
    "color": "#1B4F72",
    "lessons": [
      {
        "id": "lesson-a8-1",
        "title": "Containerization & Docker",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Packaging for Production",
            "content": "Docker packages the Java application, dependencies, and JRE into a standardized, lightweight container image. Multi-stage builds produce tiny production images."
          },
          {
            "type": "visual",
            "visual": "class-diagram",
            "visualData": {
              "classes": [
                {
                  "name": "Shape",
                  "type": "sealed interface",
                  "fields": [],
                  "methods": [
                    "permits Circle, Rectangle"
                  ]
                },
                {
                  "name": "Circle(double r)",
                  "type": "record implements Shape",
                  "fields": [
                    "r: double"
                  ],
                  "methods": []
                }
              ]
            },
            "title": "Interactive System Architecture",
            "content": "Step through and interact with the animated technical visualizer below to see how the runtime, memory, and compiler coordinate."
          },
          {
            "type": "code",
            "title": "Multi-stage Dockerfile",
            "content": "Build stage with JDK; runner stage with slim JRE.",
            "code": "FROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nCOPY target/*.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      },
      {
        "id": "lesson-a8-2",
        "title": "CI/CD & Production Readiness",
        "xp": 50,
        "slides": [
          {
            "type": "intro",
            "title": "Automated Delivery",
            "content": "Continuous Integration runs tests and linters on every commit. Continuous Deployment deploys passing artifacts safely with health checks and rollbacks."
          },
          {
            "type": "code",
            "title": "Production Health Probes",
            "content": "Liveness and Readiness checks for Kubernetes.",
            "code": "// GET /actuator/health -> {\"status\":\"UP\"}"
          },
          {
            "type": "tip",
            "title": "Authoritative Best Practice (Effective Java)",
            "content": "According to Joshua Bloch's *Effective Java* and Cay Horstmann's *Core Java*, always favor immutability, validate method preconditions, minimize member accessibility, and design APIs for clear static typing."
          }
        ]
      }
    ],
    "challenge": {
      "id": "chall-a8",
      "xp": 75,
      "questions": [
        {
          "type": "true-false",
          "question": "Multi-stage Docker builds allow compiling with a full JDK but running with a slim JRE to minimize image size and attack surface.",
          "answer": true,
          "explanation": "Multi-stage builds discard the compiler and build tools, leaving only runtime necessities."
        },
        {
          "type": "mcq",
          "question": "What does a continuous integration (CI) pipeline do upon a git push?",
          "options": [
            "Automatically compiles code and runs automated test suites",
            "Edits source code directly",
            "Purchases server hardware",
            "Deletes git branches"
          ],
          "answer": 0,
          "explanation": "CI builds code and executes automated tests on every push to detect regressions immediately."
        },
        {
          "type": "output",
          "question": "What does a standard health check endpoint return when healthy?",
          "options": [
            "UP or 200 OK",
            "DOWN",
            "Exception",
            "404"
          ],
          "answer": 0,
          "explanation": "Health endpoints return status UP with HTTP 200 to signal readiness."
        },
        {
          "type": "mcq",
          "question": "What runtime architectural advantage does Java offer for Deployment & Engineering Workflow?",
          "options": [
            "Automatic memory safety and JIT compiler optimizations",
            "Direct hardware register access like raw assembly",
            "Zero compile-time type checking",
            "Forced manual memory pointer deallocation"
          ],
          "answer": 0,
          "explanation": "The JVM provides automatic memory management (garbage collection), runtime type-safety verification, and dynamic JIT optimizations."
        }
      ]
    },
    "codingTask": {
      "id": "code-a8",
      "title": "A8: Application Health Indicator",
      "prompt": "Write a class that reports application status:\nIf database is connected and disk space > 100MB, return `\"STATUS: UP\"`\nIn main, print:\n`STATUS: UP`",
      "starterCode": "public class Main {\n    // TODO 1: Implement getHealthStatus(boolean dbOk, long freeDiskMb)\n    // If dbOk and freeDiskMb > 100, return \"STATUS: UP\", else \"STATUS: DOWN\"\n    public static String getHealthStatus(boolean dbOk, long freeDiskMb) {\n        // Your code here\n        return \"\";\n    }\n\n    public static void main(String[] args) {\n        // TODO 2: Call getHealthStatus(true, 500) and print result\n    }\n}",
      "expectedOutput": "STATUS: UP",
      "testCases": [
        {
          "name": "Health Status UP",
          "expected": "STATUS: UP"
        }
      ],
      "hints": [
        "Check both parameters."
      ]
    }
}
];

const PROJECTS = [
  {
    "id": "proj-beginner",
    "level": "beginner",
    "title": "Personal Expense Tracker (Console)",
    "description": "Build a modular console application to track daily income and expenses with categorized records, budget summaries, and robust input validation.",
    "xpReward": 250,
    "badgeId": "capstone-beginner",
    "requirements": [
      "Define an Expense class with fields (description, amount, category, date) and getter methods",
      "Create an interactive console menu loop with choices: Add Expense, List All, View Summary, and Exit",
      "Store expenses in an ArrayList<Expense> and compute total spent + category breakdowns",
      "Validate user inputs using try-catch blocks to prevent negative numbers or invalid inputs",
      "Format transaction output cleanly with currency formatting ($%.2f) and timestamps"
    ],
    "rubric": "Clean OOP class encapsulation, ArrayList usage, loops & conditionals, try-catch exception handling, and clean console output formatting.",
    "starterCode": "// ===============================================================\n//  BEGINNER CAPSTONE: Personal Expense Tracker (Console)\n// Focus: OOP Class, Methods, ArrayList, Loops, Input Validation\n//\n//  Instructions: Build your project by completing the TODOs below!\n//    If you have any doubts, open JavaBot  — it can see your code!\n// ===============================================================\nimport java.util.ArrayList;\nimport java.util.Scanner;\n\n// --- Milestone 1: Define the Expense Class ---\nclass Expense {\n    // TODO 1: Declare private fields: description (String), amount (double), category (String)\n\n    // TODO 2: Create a constructor that accepts (description, amount, category)\n\n    // TODO 3: Implement getter methods: getDescription(), getAmount(), getCategory()\n\n    // TODO 4: Override toString() to display formatted expense details\n    //         Hint: return String.format(\"[%-10s] %-20s : $%.2f\", category, description, amount);\n}\n\npublic class Main {\n    // TODO 5: Declare an ArrayList<Expense> to store user expenses\n    //         Hint: private static ArrayList<Expense> expenses = new ArrayList<>();\n\n    public static void main(String[] args) {\n        System.out.println(\"=========================================\");\n        System.out.println(\" JavaQuest Personal Expense Tracker \");\n        System.out.println(\"=========================================\");\n\n        // TODO 6: Call addExpense() with test data, or build a Scanner menu loop!\n\n        System.out.println(\" Starter skeleton loaded. Complete the TODOs to build your project!\");\n    }\n\n    // TODO 7: Implement addExpense(String desc, double amount, String category)\n    //         Validate that amount is positive! If negative, print an error message.\n\n    // TODO 8: Implement displayAll()\n    //         Loop through the expenses list and print each expense.\n\n    // TODO 9: Implement displaySummary()\n    //         Calculate the sum of all expenses and print total spending.\n}\n",
    "featureIdeas": [
      {
        "icon": "",
        "title": "Monthly Category Budget Alerts",
        "concepts": "Conditionals & Arithmetic (Modules B2, B3)",
        "description": "Define a spending limit per category (e.g. $200 for Food). Track running totals and print a prominent warning (️ Alert: 85% of Food budget reached!) when nearing the limit."
      },
      {
        "icon": "",
        "title": "CSV File Exporter & Importer",
        "concepts": "Strings, Formatting & File I/O (Modules B6, B8)",
        "description": "Export expense logs into standard CSV format ('YYYY-MM-DD,Category,Amount') using PrintWriter or FileWriter so transactions can be imported into Excel or Google Sheets."
      },
      {
        "icon": "",
        "title": "Keyword Search & Range Filtering",
        "concepts": "ArrayList & String Methods (Modules B6, B8)",
        "description": "Add search functionality to locate transactions by keyword (e.g. 'Coffee') or filter expenses within a dollar range (e.g. $20 to $100) using ArrayList iterations."
      },
      {
        "icon": "",
        "title": "Recurring Subscriptions Tracker",
        "concepts": "OOP Inheritance & Methods (Modules B5, B7)",
        "description": "Create a RecurringExpense subclass that extends Expense with a frequency field (Weekly, Monthly, Yearly) to automatically project total annual recurring costs."
      },
      {
        "icon": "️",
        "title": "Custom Exception Guardrails",
        "concepts": "Custom Exceptions & Try-Catch (Module B8)",
        "description": "Build an InvalidExpenseException class. Throw and handle it when negative numbers, empty descriptions, or unrecognized categories are entered."
      }
    ]
},
  {
    "id": "proj-intermediate",
    "level": "intermediate",
    "title": "Library / Inventory Management System",
    "description": "Build a high-performance inventory or library system using generic repositories, Stream API data analytics, and thread-safe borrow mechanics.",
    "xpReward": 350,
    "badgeId": "capstone-intermediate",
    "requirements": [
      "Create generic Repository<T> interface and Book/Item record or model classes",
      "Implement duplicate prevention and thread-safe borrow/return mechanics",
      "Filter, sort, and aggregate catalog data using Java 8+ Streams and Lambdas",
      "Persist data using JDBC PreparedStatement or in-memory structured persistence",
      "Add automated unit assertions verifying availability checks and boundary conditions"
    ],
    "rubric": "Collections, Generics, Lambdas & Streams, JDBC/SQL, Concurrency, and unit testing practices.",
    "starterCode": "// ===============================================================\n//  INTERMEDIATE CAPSTONE: Library / Inventory System\n// Focus: Generics, Streams, Records, Lambdas, Concurrency\n//\n//  Instructions: Complete the TODOs below to build your system!\n//    If you need any hints, ask JavaBot  in the corner!\n// ===============================================================\nimport java.util.*;\nimport java.util.stream.Collectors;\n\n// --- Milestone 1: Define Book Record or Model ---\n// TODO 1: Create a Book record (or class) with fields:\n//         String id, String title, String author, String genre, boolean isAvailable\n\npublic class Main {\n    // TODO 2: Declare a List<Book> catalog to store library items\n    //         Hint: private static List<Book> catalog = new ArrayList<>();\n\n    public static void main(String[] args) {\n        System.out.println(\"=========================================\");\n        System.out.println(\" JavaQuest Library Management System \");\n        System.out.println(\"=========================================\");\n\n        // TODO 3: Seed your catalog with at least 4 test books\n\n        // TODO 4: Use Java 8+ Streams to filter only available books in the \"Tech\" genre\n\n        // TODO 5: Use Collectors.groupingBy() to count how many books exist per genre\n\n        System.out.println(\" Starter skeleton loaded. Complete the TODOs to build your project!\");\n    }\n\n    // TODO 6: Implement borrowBook(String bookId) with availability checking\n\n    // TODO 7: Implement returnBook(String bookId)\n}\n",
    "featureIdeas": [
      {
        "icon": "",
        "title": "Thread-Safe Concurrent Borrowing",
        "concepts": "Concurrency & Locks (Module I8)",
        "description": "Simulate simultaneous users attempting to borrow the last available copy using ReentrantLock or AtomicInteger to prevent race conditions and double checkouts."
      },
      {
        "icon": "",
        "title": "Stream Analytics Dashboard",
        "concepts": "Lambdas & Streams (Module I4)",
        "description": "Use Collectors.groupingBy() and summarizingDouble() to generate instant reports on top borrowed authors, average ratings, and overdue counts."
      },
      {
        "icon": "️",
        "title": "JDBC Transaction Rollbacks",
        "concepts": "JDBC & SQL (Module I7)",
        "description": "Wrap multi-table checkout operations (updating book status + logging borrower history) in a database transaction with setAutoCommit(false) and rollback on error."
      },
      {
        "icon": "",
        "title": "Comprehensive Unit Test Suite",
        "concepts": "JUnit 5 Testing (Module I6)",
        "description": "Write automated test cases using @ParameterizedTest and assertThrows(BookUnavailableException.class) to test boundary and edge conditions."
      }
    ]
},
  {
    "id": "proj-advanced",
    "level": "advanced",
    "title": "Task Management REST API (Spring Boot)",
    "description": "Design and deploy an enterprise-grade REST service with JWT security, JPA persistence, and Dockerized microservice architecture.",
    "xpReward": 500,
    "badgeId": "capstone-advanced",
    "requirements": [
      "Design RESTful endpoints for CRUD tasks (GET, POST, PUT, DELETE)",
      "Implement JWT Authentication & Role-Based Access Control (Admin vs User)",
      "Configure database persistence with Spring Data JPA and transactions",
      "Add input validation (@NotNull, @Size), custom error handlers, and pagination",
      "Write a production Dockerfile and Docker Compose setup"
    ],
    "rubric": "Spring Boot, REST architecture, JPA persistence, JWT security, virtual threads, and Docker CI/CD.",
    "starterCode": "// ===============================================================\n//  ADVANCED CAPSTONE: Task Management REST API Simulator\n// Focus: REST Architecture, Enums, Maps, Lambdas, Virtual Threads\n//\n//  Instructions: Complete the TODOs below to build your API simulator!\n//    If you need any hints, ask JavaBot  in the corner!\n// ===============================================================\nimport java.time.LocalDateTime;\nimport java.util.*;\n\nenum TaskStatus { TODO, IN_PROGRESS, COMPLETED }\n\n// --- Milestone 1: Task Model ---\nclass Task {\n    // TODO 1: Define fields: id (String), title (String), assignee (String),\n    //         status (TaskStatus), createdAt (LocalDateTime)\n\n    // TODO 2: Write constructor and getter/setter methods\n}\n\npublic class Main {\n    // TODO 3: Create an in-memory data store for tasks (e.g. Map<String, Task>)\n\n    public static void main(String[] args) {\n        System.out.println(\"==================================================\");\n        System.out.println(\" JavaQuest Task Management REST API Simulator \");\n        System.out.println(\"==================================================\");\n\n        // TODO 4: Simulate REST Controller endpoints:\n        //         - POST /api/tasks (Create a task)\n        //         - GET  /api/tasks (List all tasks)\n        //         - PUT  /api/tasks/{id}/status (Update status to COMPLETED)\n        //         - GET  /api/tasks?status=COMPLETED (Filter using Streams)\n\n        System.out.println(\" Starter skeleton loaded. Complete the TODOs to build your project!\");\n    }\n\n    // TODO 5: Implement postTask(String id, String title, String assignee)\n\n    // TODO 6: Implement updateTaskStatus(String id, TaskStatus status)\n\n    // TODO 7: Implement getTasksByStatus(TaskStatus status) using Java Streams\n}\n",
    "featureIdeas": [
      {
        "icon": "",
        "title": "Java 21 Virtual Threads Engine",
        "concepts": "Virtual Threads & Concurrency (Module A2)",
        "description": "Configure Spring Boot 3 with virtual threads (spring.threads.virtual.enabled=true) to effortlessly handle 10,000+ concurrent API requests without thread starvation."
      },
      {
        "icon": "",
        "title": "Redis Second-Level Caching",
        "concepts": "Performance & Architecture (Module A4)",
        "description": "Integrate Redis caching with @Cacheable on frequently requested task summaries and @CacheEvict on modifications to achieve sub-millisecond response times."
      },
      {
        "icon": "",
        "title": "Refresh Token Rotation & OAuth2",
        "concepts": "Security & Idempotency (Module A5)",
        "description": "Implement short-lived JWT access tokens (15m) paired with database-backed refresh tokens and token reuse detection for enterprise-grade authentication."
      },
      {
        "icon": "",
        "title": "Docker Compose Multi-Container Stack",
        "concepts": "Docker & Observability (Modules A7, A8)",
        "description": "Bundle the Spring Boot API, PostgreSQL database, Prometheus metrics collector, and Grafana dashboard into a single docker-compose.yml file."
      }
    ]
}
];

const BADGES = [
  {
    "id": "first-lesson",
    "name": "First Steps",
    "icon": "",
    "description": "Completed your first lesson",
    "condition": "first_lesson"
},
  {
    "id": "first-module",
    "name": "Module Master",
    "icon": "",
    "description": "Completed your first module challenge",
    "condition": "first_module"
},
  {
    "id": "first-code",
    "name": "Code Warrior",
    "icon": "",
    "description": "Solved your first coding question",
    "condition": "first_code"
},
  {
    "id": "perfect-code",
    "name": "Ace Coder",
    "icon": "",
    "description": "Solved a coding question on 1st attempt",
    "condition": "perfect_code"
},
  {
    "id": "capstone-beginner",
    "name": "Expense Architect",
    "icon": "",
    "description": "Completed Beginner Capstone: Personal Expense Tracker",
    "condition": "capstone_beginner"
},
  {
    "id": "capstone-intermediate",
    "name": "Inventory Maestro",
    "icon": "",
    "description": "Completed Intermediate Capstone: Library System",
    "condition": "capstone_intermediate"
},
  {
    "id": "capstone-advanced",
    "name": "Enterprise Architect",
    "icon": "",
    "description": "Completed Advanced Capstone: Task REST API",
    "condition": "capstone_advanced"
},
  {
    "id": "streak-3",
    "name": "On Fire!",
    "icon": "",
    "description": "3-day learning streak",
    "condition": "streak_3"
},
  {
    "id": "streak-7",
    "name": "Week Warrior",
    "icon": "",
    "description": "7-day learning streak",
    "condition": "streak_7"
},
  {
    "id": "perfect",
    "name": "Perfectionist",
    "icon": "",
    "description": "Perfect score on a quiz challenge",
    "condition": "perfect_challenge"
},
  {
    "id": "level-5",
    "name": "Rising Engineer",
    "icon": "",
    "description": "Reached Level 5",
    "condition": "level_5"
},
  {
    "id": "level-10",
    "name": "Java Grandmaster",
    "icon": "",
    "description": "Reached Level 10",
    "condition": "level_10"
},
  {
    "id": "beginner-done",
    "name": "Foundation Champion",
    "icon": "",
    "description": "Completed all Beginner modules",
    "condition": "beginner_complete"
},
  {
    "id": "inter-done",
    "name": "Robust Developer",
    "icon": "",
    "description": "Completed all Intermediate modules",
    "condition": "inter_complete"
},
  {
    "id": "advanced-done",
    "name": "Systems Architect",
    "icon": "",
    "description": "Completed all Advanced modules",
    "condition": "advanced_complete"
},
  {
    "id": "all-modules",
    "name": "Java Legend",
    "icon": "",
    "description": "Conquered the entire 24-module map",
    "condition": "all_modules"
  },
  {
    "id": "hello-world",
    "name": "Hello World",
    "icon": "",
    "description": "Executed your first program in the Code Playground",
    "condition": "hello_world"
  },
  {
    "id": "syntax-miner",
    "name": "Syntax Miner",
    "icon": "",
    "description": "Mastered foundational Modules B1 & B2",
    "condition": "syntax_miner"
  },
  {
    "id": "redstone-logician",
    "name": "Redstone Logician",
    "icon": "",
    "description": "Mastered Operators & Boolean Logic in Module B3",
    "condition": "redstone_logic"
  },
  {
    "id": "loop-runner",
    "name": "Loop Runner",
    "icon": "",
    "description": "Conquered Control Flow & Loops in Module B4",
    "condition": "loop_runner"
  },
  {
    "id": "shield-bearer",
    "name": "Shield Bearer",
    "icon": "",
    "description": "Protected applications with Exception Handling in B8",
    "condition": "shield_bearer"
  },
  {
    "id": "clockwork-coder",
    "name": "Clockwork Coder",
    "icon": "",
    "description": "Completed 10 lessons across the JavaQuest curriculum",
    "condition": "lessons_10"
  },
  {
    "id": "brewing-master",
    "name": "Brewing Master",
    "icon": "",
    "description": "Crafted functional pipelines with Streams & Lambdas in I4",
    "condition": "streams_done"
  },
  {
    "id": "totem-undying",
    "name": "Totem of Undying",
    "icon": "",
    "description": "Completed a Quiz Challenge with full 3 hearts remaining",
    "condition": "perfect_hearts"
  }
];

const LEVELS = [
  {
    "level": 1,
    "name": "Novice",
    "xpRequired": 0,
    "icon": ""
  },
  {
    "level": 2,
    "name": "Apprentice",
    "xpRequired": 150,
    "icon": ""
  },
  {
    "level": 3,
    "name": "Coder",
    "xpRequired": 400,
    "icon": ""
  },
  {
    "level": 4,
    "name": "Developer",
    "xpRequired": 800,
    "icon": ""
  },
  {
    "level": 5,
    "name": "Engineer",
    "xpRequired": 1400,
    "icon": "️"
  },
  {
    "level": 6,
    "name": "Architect",
    "xpRequired": 2200,
    "icon": "️"
  },
  {
    "level": 7,
    "name": "Senior Dev",
    "xpRequired": 3200,
    "icon": ""
  },
  {
    "level": 8,
    "name": "Tech Lead",
    "xpRequired": 4500,
    "icon": ""
  },
  {
    "level": 9,
    "name": "Principal",
    "xpRequired": 6000,
    "icon": ""
  },
  {
    "level": 10,
    "name": "Java Grandmaster",
    "xpRequired": 8000,
    "icon": ""
  }
];


// Harmonize challenge & quizBank across all modules so they render and run seamlessly
if (typeof CURRICULUM !== 'undefined') {
  CURRICULUM.forEach(function(m) {
    if (!m.challenge && m.quizBank && m.quizBank.length) {
      m.challenge = {
        id: m.id + '_quiz',
        title: 'Knowledge Check: ' + m.title,
        xp: 50,
        questions: m.quizBank
      };
    }
    if (!m.codingTask && m.lessons && m.lessons.length) {
      // Find the last lesson's exercise to also offer as a workbench lab
      var lastLesson = m.lessons[m.lessons.length - 1];
      if (lastLesson && lastLesson.exercise) {
        m.codingTask = {
          title: lastLesson.title + ' Challenge',
          instructions: lastLesson.exercise.instructions,
          starterCode: lastLesson.exercise.starterCode,
          solution: lastLesson.exercise.solution,
          tests: lastLesson.exercise.tests,
          xp: 75
        };
      }
    }
  });
}

if (typeof window !== 'undefined') {
  window.CURRICULUM = CURRICULUM;
  window.PROJECTS   = PROJECTS;
  window.BADGES     = BADGES;
  window.LEVELS     = LEVELS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CURRICULUM, PROJECTS, BADGES, LEVELS };
}
