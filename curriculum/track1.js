// JavaQuest — Track 1: Overworld (Beginner Modules B1-B8)
// Grounded in "Head First Java", "Core Java Vol I", "Effective Java", and Java SE 21 JLS

const TRACK1_MODULES = [
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
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TRACK1_MODULES };
} else if (typeof window !== "undefined") {
  window.TRACK1_MODULES = TRACK1_MODULES;
}
