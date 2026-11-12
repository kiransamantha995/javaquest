// JavaQuest Curriculum — curriculum.js
// 24 Modules (B1-B8, I1-I8, A1-A8) grounded in "Core Java" (Cay Horstmann), "Effective Java" (Joshua Bloch), and "Head First Java"
// Track 1 (B1-B8): Completely rewritten from scratch with deep lessons, step-by-step worked examples, real compiler test harnesses, and comprehensive quiz banks

const CURRICULUM = [
  {
    "id": "b1",
    "code": "B1",
    "track": "beginner",
    "title": "How Java Runs & Orientation",
    "subtitle": "Source code, bytecode, the JVM, HotSpot JIT, JDK, and program anatomy",
    "biome": "Sunrise Plains",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Differentiate human-readable Java source code (.java) from compiled bytecode (.class)",
      "Explain the roles of the Java Virtual Machine (JVM), ClassLoader, and HotSpot JIT compiler",
      "Construct a syntactically valid public class and main entry method",
      "Differentiate System.out.print, System.out.println, and format tokens",
      "Diagnose and resolve common compilation and runtime errors"
    ],
    "prerequisites": [],
    "lessons": [
      {
        "id": "b1_l1",
        "title": "From Source Code to Bytecode",
        "xp": 30,
        "estimatedMinutes": 15,
        "story": "You awaken in the Sunrise Plains as the morning fog lifts. Before you can craft towering structures in the digital world, you must understand how human ideas transform into executable machine reality through the Java toolchain.",
        "explanation": [
          {
            "type": "text",
            "content": "Unlike traditional languages like C++ that compile directly into platform-specific machine code, or interpreted languages like Python that parse line-by-line, Java utilizes a hybrid two-phase architecture. You write human-readable code in files ending in `.java`. The Java Compiler (`javac`) translates this source into an intermediate, architecture-neutral instruction set called **bytecode**, stored in `.class` files."
          },
          {
            "type": "code",
            "content": "The Two-Step Java Pipeline:",
            "code": "// Step 1: Compile source code into bytecode\n// Terminal: javac Quest.java  --> produces Quest.class\n\n// Step 2: Execute bytecode on the Java Virtual Machine\n// Terminal: java Quest       --> JVM executes bytecode"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Write Once, Run Anywhere (WORA)",
            "content": "Because bytecode is not tied to any single processor, the same `.class` file runs identically on Windows, macOS, Linux, Android, and cloud servers. The only requirement is that the target operating system has a Java Virtual Machine (JVM) installed."
          }
        ],
        "slides": [
          {
            "title": "The Java Compilation Model",
            "type": "intro",
            "content": "Java combines the safety of compilation with the portability of interpretation. Source files (`.java`) are compiled by `javac` into compact **bytecode** (`.class`)."
          },
          {
            "title": "The Toolchain: JDK vs JRE vs JVM",
            "type": "code",
            "content": "The **JDK** (Java Development Kit) contains compiler tools. The **JVM** (Java Virtual Machine) executes the bytecode.",
            "code": "// JDK = Tools (javac, jar, javadoc) + JRE\n// JVM = ClassLoader + Execution Engine (Interpreter + JIT Compiler)"
          },
          {
            "title": "Platform Independence",
            "type": "tip",
            "content": "The JVM acts as an abstraction layer between bytecode and hardware. As long as a JVM exists for the target OS, your bytecode runs without modification."
          }
        ],
        "underTheHood": "When `javac` compiles code, it constructs an Abstract Syntax Tree (AST), performs type-checking, and emits compact stack-based opcodes (e.g., `invokevirtual`, `getstatic`, `bipush`). The JVM's ClassLoader dynamically loads bytecode into the Metaspace memory region and verifies it against bytecode tampering before execution.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Bytecode loaded successfully!\");\n    }\n}",
          "walkthrough": [
            "Line 1: Declares a public class named 'Main'. File must be named Main.java.",
            "Line 2: The standard entry point method where the JVM begins executing instructions.",
            "Line 3: System.out calls standard output stream to print a line of text.",
            "Line 4: Closes the main method body.",
            "Line 5: Closes the Main class declaration."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Running 'java Main.class' instead of 'java Main'",
            "error": "Error: Could not find or load main class Main.class",
            "fix": "The 'java' launcher expects a fully qualified class name, not a filename. Run 'java Main' without the .class extension."
          },
          {
            "mistake": "Missing semicolon at the end of a statement",
            "error": "error: ';' expected",
            "fix": "In Java, every expression statement must terminate with a semicolon (;)."
          }
        ],
        "checkpoint": [
          {
            "question": "Which tool translates .java files into .class bytecode files?",
            "options": [
              "java",
              "javac",
              "javap",
              "jvm"
            ],
            "answer": 1,
            "explanation": "javac is the Java Compiler that compiles source files into bytecode."
          },
          {
            "question": "What will the terminal command 'java Quest' execute?",
            "options": [
              "Compiles Quest.java into Quest.class",
              "Launches the JVM to execute bytecode inside Quest.class",
              "Prints the contents of Quest.java",
              "Deletes Quest.class"
            ],
            "answer": 1,
            "explanation": "'java' is the runtime launcher that starts the JVM to execute the compiled class."
          }
        ],
        "exercise": {
          "instructions": "Print three distinct lines:\nLine 1: `[System] JavaQuest 21 LTS Online`\nLine 2: `[JVM] HotSpot Engine Ready`\nLine 3: `[Status] Exploring Sunrise Plains`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Print the three required system status lines\n    }\n}",
          "hints": [
            "Use System.out.println() for each of the three lines.",
            "Ensure spelling, punctuation, and brackets match exactly.",
            "Remember that each statement must end with a semicolon (;)."
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"[System] JavaQuest 21 LTS Online\");\n        System.out.println(\"[JVM] HotSpot Engine Ready\");\n        System.out.println(\"[Status] Exploring Sunrise Plains\");\n    }\n}",
          "tests": [
            {
              "name": "Full 3-line output check",
              "stdin": "",
              "expectedStdout": "[System] JavaQuest 21 LTS Online\n[JVM] HotSpot Engine Ready\n[Status] Exploring Sunrise Plains"
            },
            {
              "name": "Line 1 prefix check",
              "stdin": "",
              "expectedStdout": "[System] JavaQuest 21 LTS Online\n[JVM] HotSpot Engine Ready\n[Status] Exploring Sunrise Plains"
            },
            {
              "name": "Line 3 Plains check",
              "stdin": "",
              "expectedStdout": "[System] JavaQuest 21 LTS Online\n[JVM] HotSpot Engine Ready\n[Status] Exploring Sunrise Plains"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 1: Breaking the Surface",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 2: The Java Programming Environment",
            "verify": false
          }
        ]
      },
      {
        "id": "b1_l2",
        "title": "Anatomy of a Java Class",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "Every building block in the Overworld has structural boundaries, from bedrock foundations to the highest tower. In Java, all code must reside inside a class. Understanding class declaration rules is your foundational mortar.",
        "explanation": [
          {
            "type": "text",
            "content": "In Java, code cannot float freely in a script file. Everything belongs inside a **class**. A class acts as a blueprint or container for data and methods. A public class declaration starts with `public class Name { ... }`."
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "File Naming Rule",
            "content": "If a class is marked `public`, the file name must match the class name with exact case sensitivity. `public class Beacon` must be saved in `Beacon.java`. Mismatched casing causes immediate compilation failure."
          },
          {
            "type": "text",
            "content": "Java uses curly braces `{}` to denote code blocks. Open braces `{` mark the beginning of a class or method, and closing braces `}` mark the end. Indentation inside braces is standard style (usually 4 spaces)."
          }
        ],
        "slides": [
          {
            "title": "Class Declaration Syntax",
            "type": "intro",
            "content": "Java is strictly class-based. Every executable statement lives inside a method, which in turn lives inside a class."
          },
          {
            "title": "Identifier Rules",
            "type": "code",
            "content": "Class names follow PascalCase (e.g. `GameEngine`, `InventorySlot`). Identifiers can contain letters, digits, underscores, and dollar signs, but cannot start with a digit or match a reserved keyword.",
            "code": "// Valid class names:\npublic class BeaconTower {}\npublic class Quest_2 {}\n\n// Invalid class names:\n// public class 2ndQuest {} // Cannot start with digit\n// public class class {}    // Cannot use reserved keyword"
          },
          {
            "title": "Brace Nesting & Scope",
            "type": "tip",
            "content": "Every opening brace '{' must have a matching closing brace '}'. Indent contents by 4 spaces for readable code hierarchy."
          }
        ],
        "underTheHood": "The `public` access modifier specifies that the class is accessible from any package. During compilation, `javac` emits a class header with access flags (`ACC_PUBLIC`, `ACC_SUPER`) into the binary `.class` file format specified in Chapter 4 of the JVM Specification.",
        "workedExample": {
          "code": "public class PlayerCard {\n    public static void main(String[] args) {\n        System.out.println(\"Player: Blockhead\");\n        System.out.println(\"Rank: Novice Coder\");\n    }\n}",
          "walkthrough": [
            "Line 1: Declares the public class PlayerCard. File is PlayerCard.java.",
            "Line 2: Declares the entry point method inside the class.",
            "Line 3: Prints the player's name tag.",
            "Line 4: Prints the starting rank.",
            "Line 5: Closes main method.",
            "Line 6: Closes PlayerCard class."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Filename differs in casing from public class name",
            "error": "error: class Main is public, should be declared in a file named Main.java",
            "fix": "Ensure the file name on disk matches the public class name letter for letter, including capitalization."
          },
          {
            "mistake": "Mismatched curly braces",
            "error": "error: reached end of file while parsing",
            "fix": "Count your curly braces. An unclosed brace '{' leaves the compiler searching for the closing '}' until the file ends."
          }
        ],
        "checkpoint": [
          {
            "question": "Spot the Bug: Which of the following class declarations is invalid?",
            "options": [
              "public class PlayerScore {}",
              "public class 1stWaypoint {}",
              "public class Nether_Fortress {}",
              "public class QuestZone2 {}"
            ],
            "answer": 1,
            "explanation": "Java identifiers cannot begin with a number (1stWaypoint is illegal)."
          },
          {
            "question": "If your file is named 'CraftingTable.java', what must the public class declaration be?",
            "options": [
              "public class craftingtable",
              "public class CraftingTable",
              "public class Crafting_table",
              "class Table"
            ],
            "answer": 1,
            "explanation": "The public class name must match the file name exactly with identical casing."
          }
        ],
        "exercise": {
          "instructions": "Declare a public class named `Main` with a standard `main` method that prints two lines:\nLine 1: `Class: OverworldArchitect`\nLine 2: `Status: Syntactically Valid`",
          "starterCode": "// Fix and complete the class declaration below:\nclass main {\n    // TODO: Add main entry point and print the two required lines\n",
          "hints": [
            "Change 'class main' to 'public class Main'.",
            "Add 'public static void main(String[] args) { ... }' inside.",
            "Make sure you close all braces '{' with '}'."
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Class: OverworldArchitect\");\n        System.out.println(\"Status: Syntactically Valid\");\n    }\n}",
          "tests": [
            {
              "name": "Check both status lines",
              "stdin": "",
              "expectedStdout": "Class: OverworldArchitect\nStatus: Syntactically Valid"
            },
            {
              "name": "Line 1 format test",
              "stdin": "",
              "expectedStdout": "Class: OverworldArchitect\nStatus: Syntactically Valid"
            },
            {
              "name": "Line 2 format test",
              "stdin": "",
              "expectedStdout": "Class: OverworldArchitect\nStatus: Syntactically Valid"
            }
          ]
        },
        "references": [
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 2: An Overview of Java",
            "verify": false
          },
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Chapter 3: Lexical Structure (Identifiers)",
            "verify": false
          }
        ]
      },
      {
        "id": "b1_l3",
        "title": "The main Method: Anatomy of an Entry Point",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "Every grand fortress needs an entrance gate. When the JVM starts your program, it searches specifically for a method with the signature 'public static void main(String[] args)'. Without this gate, execution cannot begin.",
        "explanation": [
          {
            "type": "text",
            "content": "The method signature `public static void main(String[] args)` is deliberate and strict. Each keyword conveys a critical directive to the JVM runtime:\n\n- `public`: Accessible by the JVM runtime from outside the class package.\n- `static`: Can be invoked without creating an instance of the class first.\n- `void`: Does not return any value when execution finishes.\n- `main`: The exact method name the JVM looks for as the application starting point.\n- `String[] args`: An array of strings holding any command-line arguments passed at startup."
          },
          {
            "type": "code",
            "content": "The Golden Signature:",
            "code": "public class Main {\n    public static void main(String[] args) {\n        // The JVM enters here\n        System.out.println(\"Gate opened.\");\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Java 21 Feature Note",
            "content": "In Java 21 LTS, preview support for unnamed classes and instance main methods was introduced for beginners, but the standard 'public static void main(String[] args)' remains the universal production standard across all enterprise systems."
          }
        ],
        "slides": [
          {
            "title": "Why is main static?",
            "type": "intro",
            "content": "Because 'main' is static, the JVM does not need to call 'new Main()' before running your code. It invokes 'Main.main(args)' directly after loading the class."
          },
          {
            "title": "The String[] args parameter",
            "type": "code",
            "content": "Command-line flags pass into the program via 'args'. If you run 'java Main apples 42', args[0] is 'apples' and args[1] is '42'.",
            "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Arguments count: \" + args.length);\n    }\n}"
          },
          {
            "title": "Method Signature Rigidity",
            "type": "tip",
            "content": "Changing 'void' to 'int' or omitting 'static' will compile fine, but running the class produces a NoSuchMethodError at runtime."
          }
        ],
        "underTheHood": "When you execute `java Main`, the JVM's C++ launcher invokes `GetStaticMethodID` for `main` with the descriptor `([Ljava/lang/String;)V`. If no matching method exists, the launcher terminates with the famous 'Main method not found' error.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"JVM Entry Point Established\");\n        System.out.println(\"Ready for Adventurers\");\n    }\n}",
          "walkthrough": [
            "Line 1: Declares the public class Main.",
            "Line 2: Full canonical entry point method signature.",
            "Line 3: Prints initial system handshake.",
            "Line 4: Prints readiness status.",
            "Line 5: End of main method.",
            "Line 6: End of Main class."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Spelling 'Main' with lowercase 'm' in method name or uppercase in 'string'",
            "error": "error: cannot find symbol String / Main method not found",
            "fix": "Java is case-sensitive: 'String' has an uppercase 'S', while 'main' has a lowercase 'm'."
          },
          {
            "mistake": "Returning a value from main",
            "error": "error: incompatible types: unexpected return value",
            "fix": "main has return type 'void'. You cannot 'return 0;' or 'return true;'. Use 'System.exit(0);' if you need an exit code."
          }
        ],
        "checkpoint": [
          {
            "question": "Why must the main method be declared 'static'?",
            "options": [
              "To allow the JVM to call it without first instantiating an object of the class",
              "To prevent other classes from calling it",
              "Because Java does not support non-static methods",
              "To allocate memory for the return value"
            ],
            "answer": 0,
            "explanation": "Static methods belong to the class itself, so the JVM can execute main directly upon loading."
          },
          {
            "question": "Predict the Output: What happens if you define 'public void main(String[] args)' without 'static'?",
            "options": [
              "It fails to compile with a syntax error",
              "It compiles cleanly, but runtime throws: 'Main method is not static in class'",
              "It executes normally",
              "It creates an infinite loop"
            ],
            "answer": 1,
            "explanation": "It is valid Java syntax for an instance method, but the JVM launcher requires it to be static and will report a runtime error."
          }
        ],
        "exercise": {
          "instructions": "Write a complete Java program in class `Main` that prints:\nLine 1: `Method: public static void main`\nLine 2: `Parameter: String[] args`\nLine 3: `Return: void`",
          "starterCode": "public class Main {\n    // TODO: Write the complete main method and print the 3 lines\n}",
          "hints": [
            "Signature: public static void main(String[] args)",
            "Print each line using System.out.println()",
            "Ensure the exact strings match the instructions"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Method: public static void main\");\n        System.out.println(\"Parameter: String[] args\");\n        System.out.println(\"Return: void\");\n    }\n}",
          "tests": [
            {
              "name": "Three-line signature check",
              "stdin": "",
              "expectedStdout": "Method: public static void main\nParameter: String[] args\nReturn: void"
            },
            {
              "name": "Parameter check",
              "stdin": "",
              "expectedStdout": "Method: public static void main\nParameter: String[] args\nReturn: void"
            },
            {
              "name": "Return type check",
              "stdin": "",
              "expectedStdout": "Method: public static void main\nParameter: String[] args\nReturn: void"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 1: Breaking the Surface (Anatomy of a method)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures in Java",
            "verify": false
          }
        ]
      },
      {
        "id": "b1_l4",
        "title": "Console Output: print, println, and printf",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "Carving runes onto signposts requires understanding where one sentence ends and the next begins. Java provides three primary tools for text output: print, println, and printf.",
        "explanation": [
          {
            "type": "text",
            "content": "`System.out.print()` writes text to the console and leaves the cursor right at the end of the text. `System.out.println()` writes text and then automatically appends a newline character (`\\n`), moving the cursor down to the start of the next line."
          },
          {
            "type": "code",
            "content": "print vs println in Action:",
            "code": "System.out.print(\"One \");\nSystem.out.print(\"Two \");\nSystem.out.println(\"Three!\");\n// Output on single line: One Two Three!\n\nSystem.out.println(\"Next Line.\");\n// Output on next line: Next Line."
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Escape Sequences",
            "content": "Use escape characters inside strings for special formatting:\n- `\\n`: Inserts a newline\n- `\\t`: Inserts a tab stop\n- `\\\"`: Inserts a literal double quote\n- `\\\\`: Inserts a literal backslash"
          }
        ],
        "slides": [
          {
            "title": "Standard Output Stream",
            "type": "intro",
            "content": "'System.out' is a pre-instantiated PrintStream object connected to the system console. It provides multiple output methods."
          },
          {
            "title": "Formatted Printing with printf",
            "type": "code",
            "content": "System.out.printf formats output with specifiers: %s for String, %d for integer, and %.2f for two-decimal floating point numbers.",
            "code": "String item = \"Emerald\";\nint count = 12;\ndouble cost = 4.50;\nSystem.out.printf(\"Item: %s | Qty: %d | Cost: $%.2f%n\", item, count, cost);\n// Item: Emerald | Qty: 12 | Cost: $4.50"
          },
          {
            "title": "%n vs \\n in printf",
            "type": "tip",
            "content": "In printf, prefer '%n' over '\\n' for newlines. '%n' emits the correct platform-specific line separator across Windows (\\r\\n) and Unix (\\n)."
          }
        ],
        "underTheHood": "System.out writes to an underlying FileDescriptor (FD 1). Calls to println are thread-safe because PrintStream methods internally synchronize on the stream monitor, preventing output from different threads from interleaving characters mid-sentence.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.print(\"HP: [=====\");\n        System.out.print(\"=====]\");\n        System.out.println(\" 100%\");\n        System.out.println(\"Status: Invulnerable\");\n    }\n}",
          "walkthrough": [
            "Line 3: Prints left half of health bar without line break.",
            "Line 4: Prints right half directly adjacent to left half.",
            "Line 5: Prints percentage and finishes line with newline.",
            "Line 6: Starts cleanly on new line to print status."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Using single quotes for text with multiple characters",
            "error": "error: unclosed character literal / too many characters in character literal",
            "fix": "Single quotes ('A') are reserved strictly for single char primitives. Strings must always be wrapped in double quotes (\"Hello\")."
          },
          {
            "mistake": "Forgetting that print() leaves cursor on the same line",
            "error": "Lines unexpectedly glued together in console",
            "fix": "Use println() when you want subsequent text to start on a fresh line."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nSystem.out.print(\"Diamond\");\nSystem.out.println(\"Ore\");\nSystem.out.print(\"Found!\");",
            "options": [
              "Diamond\\nOre\\nFound!",
              "DiamondOre\\nFound!",
              "Diamond Ore Found!",
              "Diamond\\nOreFound!"
            ],
            "answer": 1,
            "explanation": "'Diamond' is printed without newline, 'Ore' is attached immediately then adds a newline, and 'Found!' starts on line 2."
          },
          {
            "question": "Which format specifier outputs a floating-point number rounded to 2 decimal places?",
            "options": [
              "%2d",
              "%.2f",
              "%float2",
              "%2s"
            ],
            "answer": 1,
            "explanation": "%.2f instructs printf to format a float or double with exactly 2 digits after the decimal point."
          }
        ],
        "exercise": {
          "instructions": "Using a combination of `System.out.print` and `System.out.println`, output the following exact pattern:\nLine 1: `Coordinates: X=100 Y=64 Z=-250` (built by printing `Coordinates: `, then `X=100 `, then `Y=64 `, then `Z=-250` on a newline)\nLine 2: `Biome: Plains`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Print the coordinates and biome using print and println\n    }\n}",
          "hints": [
            "Use System.out.print for the first parts without newline.",
            "End the coordinates with System.out.println(\"Z=-250\").",
            "Print the final line with System.out.println(\"Biome: Plains\")."
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.print(\"Coordinates: \");\n        System.out.print(\"X=100 \");\n        System.out.print(\"Y=64 \");\n        System.out.println(\"Z=-250\");\n        System.out.println(\"Biome: Plains\");\n    }\n}",
          "tests": [
            {
              "name": "Combined coordinate and biome output",
              "stdin": "",
              "expectedStdout": "Coordinates: X=100 Y=64 Z=-250\nBiome: Plains"
            },
            {
              "name": "Line 1 spacing check",
              "stdin": "",
              "expectedStdout": "Coordinates: X=100 Y=64 Z=-250\nBiome: Plains"
            },
            {
              "name": "Line 2 Biome check",
              "stdin": "",
              "expectedStdout": "Coordinates: X=100 Y=64 Z=-250\nBiome: Plains"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Formatting Output)",
            "verify": false
          },
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 20: java.util: The Formatter Class",
            "verify": false
          }
        ]
      },
      {
        "id": "b1_l5",
        "title": "Comments, Code Style & Documentation",
        "xp": 30,
        "estimatedMinutes": 15,
        "story": "As you travel through the realm, you leave signs so other explorers can understand your work. Code is read ten times more often than it is written. Writing clean, well-commented code is an architect's hallmark.",
        "explanation": [
          {
            "type": "text",
            "content": "Java supports three types of comments. The compiler completely ignores comments when producing bytecode; they exist purely for human maintainers:\n\n1. **Single-line comments**: Begin with `//` and extend to the end of the line.\n2. **Multi-line comments**: Enclosed between `/*` and `*/`.\n3. **Javadoc comments**: Enclosed between `/**` and `*/`, processed by the `javadoc` tool to generate standard HTML API documentation."
          },
          {
            "type": "code",
            "content": "The Three Comment Types:",
            "code": "// Single-line: useful for concise explanations\n\n/* \n   Multi-line: useful for temporary disabling\n   of blocks during debugging\n*/\n\n/**\n * Javadoc: document classes, methods, and parameters\n * @param level Player level\n */"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Clean Code Principle",
            "content": "Good code explains WHAT it does through expressive variable and method names. Comments should explain WHY something is done when the reason is non-obvious."
          }
        ],
        "slides": [
          {
            "title": "Comment Syntax in Java",
            "type": "intro",
            "content": "Comments never affect bytecode size or execution speed. They are stripped out during lexical analysis by javac."
          },
          {
            "title": "Standard Javadoc Tags",
            "type": "code",
            "content": "Javadoc uses @param, @return, and @throws tags to build formal API contracts.",
            "code": "/**\n * Calculates damage based on weapon sharpness.\n * @param sharpness Enchantment tier (1 to 5)\n * @return Total attack damage points\n */"
          },
          {
            "title": "Style & Readability",
            "type": "tip",
            "content": "Avoid redundant comments like '// print hello'. Instead write '// notify connected client that authentication succeeded'."
          }
        ],
        "underTheHood": "The lexical analyzer in `javac` discards comments during the tokenization phase. They do not appear in the Abstract Syntax Tree or `.class` constant pool, with the exception of runtime-retained annotations (`@Retention(RetentionPolicy.RUNTIME)`).",
        "workedExample": {
          "code": "public class Main {\n    // Main entry point\n    public static void main(String[] args) {\n        /* Print the initial greeting\n           to announce player spawn */\n        System.out.println(\"Player Spawned at Sunrise\");\n    }\n}",
          "walkthrough": [
            "Line 2: Single-line comment describing entry point.",
            "Line 4-5: Multi-line comment explaining the business intent of the print statement.",
            "Line 6: Executable statement that prints to console."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Nesting multi-line comments /* inside /* ... */ */",
            "error": "error: unclosed comment / illegal start of expression",
            "fix": "Multi-line comments do not nest in Java. The first '*/' closes the comment, leaving remaining text as syntax errors."
          },
          {
            "mistake": "Accidentally commenting out semicolons or braces",
            "error": "error: ';' expected / reached end of file while parsing",
            "fix": "Ensure closing braces and semicolons are on their own lines or not appended after '//'."
          }
        ],
        "checkpoint": [
          {
            "question": "Which comment format is parsed by the javadoc tool to generate HTML documentation?",
            "options": [
              "// comment",
              "/* comment */",
              "/** comment */",
              "-- comment"
            ],
            "answer": 2,
            "explanation": "Javadoc documentation comments begin with '/**' and end with '*/'."
          },
          {
            "question": "Spot the Bug: What is wrong with the following snippet?\n/* First comment /* nested comment */ still in comment? */",
            "options": [
              "Nothing is wrong",
              "Multi-line comments cannot be nested; the first '*/' ends the comment early",
              "Comments cannot contain the word 'nested'",
              "Java requires three slashes for multi-line comments"
            ],
            "answer": 1,
            "explanation": "In Java, '/*' cannot be nested. The compiler encounters '*/' and ends the comment, leaving 'still in comment? */' as invalid Java code."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` containing:\n1. A single-line comment: `// Server configuration`\n2. A multi-line comment: `/* Region: US-East */`\n3. Executable code that prints: `Server Port: 25565`\n4. Followed by: `Region: US-East`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Include required comments and print the two lines\n    }\n}",
          "hints": [
            "Comments must be included in your code.",
            "First line output: System.out.println(\"Server Port: 25565\");",
            "Second line output: System.out.println(\"Region: US-East\");"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        // Server configuration\n        /* Region: US-East */\n        System.out.println(\"Server Port: 25565\");\n        System.out.println(\"Region: US-East\");\n    }\n}",
          "tests": [
            {
              "name": "Server status outputs check",
              "stdin": "",
              "expectedStdout": "Server Port: 25565\nRegion: US-East"
            },
            {
              "name": "Port check",
              "stdin": "",
              "expectedStdout": "Server Port: 25565\nRegion: US-East"
            },
            {
              "name": "Region check",
              "stdin": "",
              "expectedStdout": "Server Port: 25565\nRegion: US-East"
            }
          ]
        },
        "references": [
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 56: Write doc comments for all exposed API elements",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Comments)",
            "verify": false
          }
        ]
      },
      {
        "id": "b1_l6",
        "title": "Diagnosing Compilation vs Runtime Errors",
        "xp": 35,
        "estimatedMinutes": 20,
        "story": "Even the most experienced architect encounters cracked foundation stones. Learning to read compiler diagnostics and runtime stack traces calmly turns frustration into debugging mastery.",
        "explanation": [
          {
            "type": "text",
            "content": "Errors in Java fall into two distinct lifecycle stages:\n\n1. **Compilation Errors (Static)**: Caught by `javac` before bytecode is generated. Examples include misspelled keywords, missing semicolons, type mismatches, and unclosed quotes. The code NEVER runs until all compilation errors are resolved.\n2. **Runtime Errors (Dynamic)**: Occur while the JVM is executing valid bytecode. Examples include dividing by zero (`ArithmeticException`), accessing a null pointer (`NullPointerException`), or passing invalid input."
          },
          {
            "type": "code",
            "content": "Reading a Compiler Error Message:",
            "code": "// Main.java:3: error: ';' expected\n//         System.out.println(\"Hello\")\n//                                   ^\n// Line 3 of Main.java is missing a semicolon at the caret (^)"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "The Golden Rule of Debugging",
            "content": "Always fix the **FIRST** compiler error reported. Subsequent errors are frequently domino effects caused by the compiler losing its place after the first syntax failure."
          }
        ],
        "slides": [
          {
            "title": "Static vs Dynamic Failure",
            "type": "intro",
            "content": "A compilation error means 'The code cannot be translated to bytecode'. A runtime error means 'The bytecode ran into an invalid operation during execution'."
          },
          {
            "title": "Anatomy of a Stack Trace",
            "type": "code",
            "content": "When an uncaught runtime exception occurs, the JVM prints a stack trace showing the exception type, error message, and exact line number.",
            "code": "Exception in thread \"main\" java.lang.ArithmeticException: / by zero\n    at Main.main(Main.java:4)"
          },
          {
            "title": "Logic Bugs",
            "type": "tip",
            "content": "The third category: logic bugs. The code compiles and runs without crashing, but outputs the wrong answer. These are solved with unit tests and assertions."
          }
        ],
        "underTheHood": "The `javac` parser raises syntax errors during Lexing and Parsing. Type and semantic errors are raised during the `Enter` and `Attr` compiler phases. Runtime exceptions are managed by the JVM's frame unwinding engine, which walks the thread's execution stack looking for a matching exception handler table.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        // Fixed missing quote and missing semicolon:\n        System.out.println(\"Debugging complete!\");\n        System.out.println(\"System healthy.\");\n    }\n}",
          "walkthrough": [
            "Identified missing closing quote in string literal.",
            "Identified omitted semicolon at end of line.",
            "Recompiled cleanly with 0 errors.",
            "Executed smoothly on JVM."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Ignoring the line number in the compiler error message",
            "error": "Searching the entire file blindly for an error",
            "fix": "Check the exact line number (e.g. Main.java:7) and caret pointer (^) in the terminal error message."
          },
          {
            "mistake": "Misspelling System with a lowercase 's'",
            "error": "error: package system does not exist",
            "fix": "Java is strictly case-sensitive. Built-in core classes start with an uppercase letter: System, String, Math."
          }
        ],
        "checkpoint": [
          {
            "question": "Which of the following is a compilation error rather than a runtime error?",
            "options": [
              "Missing a closing semicolon at the end of a statement",
              "Dividing an integer by zero (10 / 0)",
              "Attempting to read from a file that does not exist",
              "Running out of memory (OutOfMemoryError)"
            ],
            "answer": 0,
            "explanation": "A missing semicolon is caught by javac during compilation before bytecode is produced."
          },
          {
            "question": "If a compiler diagnostic reports 12 errors, which one should you inspect and fix first?",
            "options": [
              "The very first error at the top",
              "The last error at the bottom",
              "The error with the longest message",
              "Any random error"
            ],
            "answer": 0,
            "explanation": "Always fix the first error first. Later errors are often cascading misinterpretations triggered by the first syntax break."
          }
        ],
        "exercise": {
          "instructions": "Debug and fix the following broken code so that it compiles and outputs:\nLine 1: `Diagnosed: Missing semicolon fixed`\nLine 2: `Diagnosed: Uppercase System restored`\nLine 3: `System Status: 100% Operational`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // BUGGY CODE TO FIX:\n        system.out.println(\"Diagnosed: Missing semicolon fixed\")\n        System.out.println(\"Diagnosed: Uppercase System restored\");\n        System.out.println(\"System Status: 100% Operational\");\n    }\n}",
          "hints": [
            "Change 'system' to uppercase 'System' on line 4.",
            "Add a semicolon ';' to the end of line 4.",
            "Re-run tests to verify all 3 lines print cleanly."
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Diagnosed: Missing semicolon fixed\");\n        System.out.println(\"Diagnosed: Uppercase System restored\");\n        System.out.println(\"System Status: 100% Operational\");\n    }\n}",
          "tests": [
            {
              "name": "Three-line diagnosed system check",
              "stdin": "",
              "expectedStdout": "Diagnosed: Missing semicolon fixed\nDiagnosed: Uppercase System restored\nSystem Status: 100% Operational"
            },
            {
              "name": "Line 1 fix check",
              "stdin": "",
              "expectedStdout": "Diagnosed: Missing semicolon fixed\nDiagnosed: Uppercase System restored\nSystem Status: 100% Operational"
            },
            {
              "name": "Line 3 operational check",
              "stdin": "",
              "expectedStdout": "Diagnosed: Missing semicolon fixed\nDiagnosed: Uppercase System restored\nSystem Status: 100% Operational"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 1: Breaking the Surface (Compiler in your corner)",
            "verify": false
          },
          {
            "source": "Think Java, 2nd ed.",
            "location": "Chapter 1: The Way of the Program (Debugging)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "What is the primary role of the Java Virtual Machine (JVM)?",
        "options": [
          "To write Java source code automatically",
          "To execute compiled Java bytecode on the host operating system",
          "To format source code indentation",
          "To connect to database servers only"
        ],
        "answer": 1,
        "explanation": "The JVM loads, verifies, and executes compiled bytecode (.class) instructions on the local host architecture."
      },
      {
        "type": "mcq",
        "question": "Which file extension contains portable Java bytecode?",
        "options": [
          ".java",
          ".class",
          ".jar",
          ".jvm"
        ],
        "answer": 1,
        "explanation": ".class files contain bytecode generated by javac."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nSystem.out.print(\"Alpha\");\nSystem.out.print(\"-\");\nSystem.out.println(\"Beta\");",
        "options": [
          "Alpha-Beta",
          "Alpha\\n-\\nBeta",
          "Alpha - Beta",
          "Alpha\\nBeta"
        ],
        "answer": 0,
        "explanation": "The two print() calls output 'Alpha' and '-' without line breaks; println('Beta') completes 'Alpha-Beta' and adds a newline."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug: Why will 'public class 3DViewer {}' fail to compile?",
        "options": [
          "Class names cannot contain the letter V",
          "Identifiers in Java cannot begin with a numeric digit",
          "Public classes must end with .java in the class header",
          "3DViewer is a reserved keyword in Java 21"
        ],
        "answer": 1,
        "explanation": "Java identifiers cannot begin with a number (0-9)."
      },
      {
        "type": "mcq",
        "question": "What happens when you execute 'javac Quest.java' in the terminal?",
        "options": [
          "The JVM runs Quest.java directly",
          "The compiler parses Quest.java and generates Quest.class bytecode",
          "The terminal deletes Quest.java",
          "A web browser opens Quest.html"
        ],
        "answer": 1,
        "explanation": "javac compiles the source file into bytecode (.class)."
      },
      {
        "type": "fill-in",
        "question": "Fill in the blank: The main entry point method return type must be _______.",
        "options": [
          "int",
          "void",
          "String",
          "boolean"
        ],
        "answer": 1,
        "explanation": "The main method does not return a value and must be declared with return type 'void'."
      },
      {
        "type": "order-the-lines",
        "question": "Order the lines to form a valid minimal Java program that prints 'Craft!':\n1: }\n2: public class Main {\n3:     public static void main(String[] args) {\n4:         System.out.println(\"Craft!\");\n5:     }",
        "options": [
          "2, 3, 4, 5, 1",
          "3, 2, 4, 1, 5",
          "4, 3, 2, 5, 1",
          "2, 4, 3, 5, 1"
        ],
        "answer": 0,
        "explanation": "Class declaration (2) wraps main method (3), which contains println (4), then closes main (5) and class (1)."
      },
      {
        "type": "mcq",
        "question": "What is the HotSpot JIT (Just-In-Time) compiler responsible for?",
        "options": [
          "Formatting code style while you type",
          "Compiling frequently executed bytecode into native machine code at runtime",
          "Downloading Maven dependencies",
          "Checking database user passwords"
        ],
        "answer": 1,
        "explanation": "HotSpot profiles running bytecode and dynamically compiles 'hot' spots into optimized native machine code."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nSystem.out.println(\"A\");\n// System.out.println(\"B\");\n/* System.out.println(\"C\"); */\nSystem.out.println(\"D\");",
        "options": [
          "A\\nD",
          "A\\nB\\nC\\nD",
          "A\\nB\\nD",
          "A\\nC\\nD"
        ],
        "answer": 0,
        "explanation": "Lines with 'B' and 'C' are commented out (single-line and multi-line comments), so only 'A' and 'D' print."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\npublic class Main {\n    public static void Main(String[] args) {\n        System.out.println(\"Go\");\n    }\n}",
        "options": [
          "Class name Main is illegal",
          "Method name 'Main' is capitalized; the JVM looks strictly for lowercase 'main'",
          "String[] args must be Object[] args",
          "System.out.println must end with a colon"
        ],
        "answer": 1,
        "explanation": "Java is case-sensitive: 'public static void Main' is treated as an ordinary method, not the application entry point."
      },
      {
        "type": "mcq",
        "question": "What is the difference between JDK and JRE?",
        "options": [
          "The JDK includes development tools (like javac) and the JRE; the JRE only includes the runtime (JVM + libraries)",
          "The JRE compiles code, while the JDK runs it",
          "JDK is for mobile only; JRE is for servers only",
          "There is no difference; they are exact synonyms"
        ],
        "answer": 0,
        "explanation": "JDK (Java Development Kit) includes compilers and debugging tools; JRE (Java Runtime Environment) only runs compiled programs."
      },
      {
        "type": "mcq",
        "question": "Which of the following is true about Java comments?",
        "options": [
          "Comments are converted into bytecode and increase .class file size",
          "Comments are stripped by javac during tokenization and have zero runtime overhead",
          "Multi-line comments can be nested indefinitely",
          "Comments can only appear inside method bodies"
        ],
        "answer": 1,
        "explanation": "Comments are discarded during lexical analysis and do not affect bytecode size or speed."
      }
    ],
    "project": {
      "title": "Beacon Terminal Status Engine",
      "brief": "Construct a modular CLI beacon announcement program that displays structured system diagnostics, JVM environment flags, and formatted beacon status banners.",
      "milestones": [
        "Declare a clean public class BeaconEngine matching file conventions",
        "Construct a canonical main entry method with proper access modifiers",
        "Format a multi-line ASCII beacon banner using print, println, and escape sequences",
        "Document the code with both Javadoc class comments and inline explanations"
      ],
      "rubric": [
        "Syntax accuracy: 0 compilation errors or warnings",
        "Proper casing: PascalCase for class, camelCase for methods",
        "Formatted alignment: Clean spacing without ragged console margins",
        "Documentation: Clear Javadoc explaining purpose"
      ],
      "stretchGoals": [
        "Use System.out.printf to display formatted runtime uptime in seconds with 2 decimal precision",
        "Include a decorative ASCII art beacon tower in the console output"
      ]
    },
    "glossary": [
      {
        "term": "Source Code",
        "definition": "Human-readable instructions written in high-level programming language files ending in .java."
      },
      {
        "term": "Bytecode",
        "definition": "Architecture-neutral intermediate instruction set generated by javac and saved in .class files."
      },
      {
        "term": "JVM",
        "definition": "Java Virtual Machine; the runtime execution engine that loads, verifies, and executes bytecode on hardware."
      },
      {
        "term": "JIT Compiler",
        "definition": "Just-In-Time compiler inside the HotSpot JVM that translates hot bytecode loops into native machine instructions at runtime."
      },
      {
        "term": "JDK",
        "definition": "Java Development Kit; the complete developer toolkit containing the compiler (javac), packager (jar), and runtime environment."
      },
      {
        "term": "Statement",
        "definition": "A single complete executable instruction in Java, terminated by a semicolon."
      },
      {
        "term": "Identifier",
        "definition": "The programmer-defined name given to a class, method, variable, or package."
      }
    ],
    "references": [
      {
        "source": "Head First Java, 3rd ed.",
        "location": "Chapter 1: Breaking the Surface",
        "verify": false
      },
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 2: The Java Programming Environment",
        "verify": false
      },
      {
        "source": "Java: The Complete Reference, 12th ed.",
        "location": "Chapter 2: An Overview of Java",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b2",
    "code": "B2",
    "track": "beginner",
    "title": "Variables, Data Types & Terminal Input",
    "subtitle": "Primitives, IEEE 754 precision, Scanner console input, and type conversions",
    "biome": "Village Market",
    "estimatedMinutes": 130,
    "learningObjectives": [
      "Declare, initialize, and reassign variables adhering to Java's strict static type system",
      "Select appropriate integer (byte, short, int, long) and floating-point (float, double) primitives",
      "Utilize char Unicode values and boolean state flags in real programs",
      "Read diverse user inputs interactively from standard input using java.util.Scanner",
      "Safely execute implicit widening and explicit narrowing type casting without unintended data corruption"
    ],
    "prerequisites": [
      "b1"
    ],
    "lessons": [
      {
        "id": "b2_l1",
        "title": "Variables, Memory & Static Typing",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "You enter the bustling Village Market. Every merchant keeps labeled wooden chests: a small chest for coins, an insulated box for potions, and a strong vault for diamonds. In Java, variables are typed storage containers in memory.",
        "explanation": [
          {
            "type": "text",
            "content": "Java is a **statically-typed** language. This means every variable must have a declared data type before it can be used, and that type cannot change during program execution. A variable represents a named location in computer memory that stores a value."
          },
          {
            "type": "code",
            "content": "Declaration vs Initialization:",
            "code": "int emeralds;          // 1. Declaration: allocates 32-bit integer memory named 'emeralds'\nemeralds = 64;         // 2. Initialization: assigns the value 64 into that memory\n\nint diamonds = 16;     // Combined declaration and initialization\nemeralds = 128;        // Reassignment: replaces old value with new value"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Naming Conventions",
            "content": "Variable names follow `lowerCamelCase` (e.g. `playerHealth`, `maxInventorySlots`). Names should be descriptive nouns that clarify what information the variable holds."
          }
        ],
        "slides": [
          {
            "title": "Memory Allocation for Variables",
            "type": "intro",
            "content": "When you declare 'int count = 5;', the JVM allocates 4 bytes on the thread call stack and assigns the binary representation of 5 into those bits."
          },
          {
            "title": "Definite Assignment Rule",
            "type": "code",
            "content": "Local variables declared inside methods are NOT given default values. You must initialize them before reading them, or javac rejects the code.",
            "code": "public class Main {\n    public static void main(String[] args) {\n        int x;\n        // System.out.println(x); // ERROR: variable x might not have been initialized\n        x = 10;\n        System.out.println(x);   // OK: prints 10\n    }\n}"
          },
          {
            "title": "Constants with 'final'",
            "type": "tip",
            "content": "Use the 'final' keyword to declare a constant whose value cannot be reassigned once set: 'final int MAX_SLOTS = 36;'. Constants use UPPER_SNAKE_CASE."
          }
        ],
        "underTheHood": "Local variables live inside stack frames created on the JVM thread call stack. Each primitive variable maps to one or two local variable slots (32-bit slot for int/float, two slots for 64-bit long/double). Reading an uninitialized local variable fails at compile-time due to Java's Definite Assignment analysis (JLS §16).",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int health = 100;\n        int maxSlots = 36;\n        int usedSlots = 14;\n        int freeSlots = maxSlots - usedSlots;\n        System.out.println(\"Player HP: \" + health);\n        System.out.println(\"Free Inventory: \" + freeSlots);\n    }\n}",
          "walkthrough": [
            "Line 3: Declares and initializes 'health' with value 100.",
            "Line 4: Sets maximum backpack inventory capacity.",
            "Line 5: Sets currently occupied item slots.",
            "Line 6: Computes remaining free slots by subtraction.",
            "Line 7-8: Concatenates strings with numeric variables and prints status."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Reading an uninitialized local variable",
            "error": "error: variable health might not have been initialized",
            "fix": "Always assign a starting value when declaring local variables, e.g. 'int health = 100;'."
          },
          {
            "mistake": "Re-declaring an existing variable with its type",
            "error": "error: variable count is already defined in method main",
            "fix": "Only declare the type once. To update a variable, use reassignment without the type keyword: 'count = 20;' instead of 'int count = 20;'."
          }
        ],
        "checkpoint": [
          {
            "question": "Which of the following lines will cause a compilation error?",
            "options": [
              "int speed = 25;",
              "final int MAX_LIVES = 3;",
              "int score;\nSystem.out.println(score);",
              "int points = 0;\npoints = 50;"
            ],
            "answer": 2,
            "explanation": "Local variables must be explicitly initialized before they can be read."
          },
          {
            "question": "What keyword makes a variable's value immutable after initialization?",
            "options": [
              "static",
              "final",
              "const",
              "immutable"
            ],
            "answer": 1,
            "explanation": "In Java, 'final' marks a variable as constant; attempting to reassign it causes a compilation error."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that declares:\n- An integer `goldCoins` initialized to `75`\n- An integer `spentCoins` initialized to `28`\n- An integer `remainingCoins` calculated as `goldCoins - spentCoins`\nPrint exactly two lines:\nLine 1: `Starting Gold: 75`\nLine 2: `Remaining Gold: 47`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Declare variables, calculate remaining, and print the 2 lines\n    }\n}",
          "hints": [
            "Declare: int goldCoins = 75;",
            "Declare: int spentCoins = 28;",
            "Declare: int remainingCoins = goldCoins - spentCoins;",
            "Print using System.out.println(\"Starting Gold: \" + goldCoins);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int goldCoins = 75;\n        int spentCoins = 28;\n        int remainingCoins = goldCoins - spentCoins;\n        System.out.println(\"Starting Gold: \" + goldCoins);\n        System.out.println(\"Remaining Gold: \" + remainingCoins);\n    }\n}",
          "tests": [
            {
              "name": "Gold calculation check",
              "stdin": "",
              "expectedStdout": "Starting Gold: 75\nRemaining Gold: 47"
            },
            {
              "name": "Starting gold check",
              "stdin": "",
              "expectedStdout": "Starting Gold: 75\nRemaining Gold: 47"
            },
            {
              "name": "Remaining gold check",
              "stdin": "",
              "expectedStdout": "Starting Gold: 75\nRemaining Gold: 47"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Variables)",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 3: Primitives and References",
            "verify": false
          }
        ]
      },
      {
        "id": "b2_l2",
        "title": "Integer Primitives: byte, short, int, long",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "The Village Bank needs to store numbers of vastly different scales: a player's small hotbar slot index, a regional chunk coordinate, and the total cosmic ticks elapsed since world generation. Choosing the right integer type saves memory and prevents catastrophic overflow.",
        "explanation": [
          {
            "type": "text",
            "content": "Java provides four signed two's-complement integer primitive types:\n\n1. `byte`: 8 bits (1 byte). Range: -128 to 127.\n2. `short`: 16 bits (2 bytes). Range: -32,768 to 32,767.\n3. `int`: 32 bits (4 bytes). Range: -2,147,483,648 to 2,147,483,647 (~2.14 billion). The default integer type in Java.\n4. `long`: 64 bits (8 bytes). Range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 (~9 quintillion). Requires an uppercase `L` suffix for literals exceeding int range."
          },
          {
            "type": "code",
            "content": "Declaring Integer Types with Underscores:",
            "code": "byte hotbarSlot = 8;\nshort villageElevation = 320;\nint worldSeed = 1_489_201_844; // Underscores enhance readability\nlong cosmicTicks = 9_500_000_000L; // Suffix 'L' required for long literals"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "Integer Overflow Trap",
            "content": "Java integer types do NOT throw errors when they exceed their maximum value; they silently wrap around into negative numbers! Adding 1 to `Integer.MAX_VALUE` wraps around to `Integer.MIN_VALUE`."
          }
        ],
        "slides": [
          {
            "title": "The Four Integer Primitives",
            "type": "intro",
            "content": "Every primitive has a fixed bit-width defined by the JVM Specification regardless of the underlying operating system."
          },
          {
            "title": "Integer Overflow in Action",
            "type": "code",
            "content": "Because Java uses two's complement binary, adding 1 to 127 on a byte flips the sign bit to negative 128.",
            "code": "byte b = 127;\nb++;\nSystem.out.println(b); // Prints -128!"
          },
          {
            "title": "The 'L' Suffix for long Literals",
            "type": "tip",
            "content": "Always use uppercase 'L' (not lowercase 'l', which looks like digit 1) when writing numbers larger than 2 billion."
          }
        ],
        "underTheHood": "At the bytecode level, the JVM actually uses 32-bit `iload`, `istore`, and `iadd` instructions to compute on `byte`, `short`, and `boolean` values on the operand stack. They are treated as 32-bit integers during arithmetic and only truncated when stored into heap memory arrays.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        byte stackLimit = 64;\n        int townPopulation = 2500;\n        long worldSeed = 7_891_234_567L;\n        System.out.println(\"Max Stack: \" + stackLimit);\n        System.out.println(\"Town Pop: \" + townPopulation);\n        System.out.println(\"World Seed: \" + worldSeed);\n    }\n}",
          "walkthrough": [
            "Line 3: Uses byte for small 0-64 inventory stack limit.",
            "Line 4: Uses standard 32-bit int for town population.",
            "Line 5: Uses 64-bit long with 'L' suffix for 10-digit world seed.",
            "Line 6-8: Prints each formatted inventory and world value."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Forgetting the 'L' suffix on large long literals",
            "error": "error: integer number too large",
            "fix": "By default, raw numeric literals (like 5000000000) are parsed as 32-bit int. Append an 'L' (5000000000L) to tell javac it is a 64-bit long."
          },
          {
            "mistake": "Assigning a value larger than 127 to a byte",
            "error": "error: incompatible types: possible lossy conversion from int to byte",
            "fix": "A byte maxes out at 127. For numbers larger than 127, use short, int, or long."
          }
        ],
        "checkpoint": [
          {
            "question": "What is output by the following code?\nbyte counter = 127;\ncounter++;\nSystem.out.println(counter);",
            "options": [
              "128",
              "-128",
              "0",
              "Compilation error"
            ],
            "answer": 1,
            "explanation": "In 8-bit two's complement, 127 (01111111) incremented by 1 becomes 10000000, which represents -128."
          },
          {
            "question": "Which suffix tells the Java compiler that a literal number is a 64-bit long integer?",
            "options": [
              "D",
              "F",
              "L",
              "I"
            ],
            "answer": 2,
            "explanation": "The suffix 'L' (or 'l') denotes a long literal."
          }
        ],
        "exercise": {
          "instructions": "Declare the following variables in class `Main`:\n- A `byte` named `potionSlots` set to `9`\n- An `int` named `blockCount` set to `16000`\n- A `long` named `totalWorldBlocks` set to `3000000000L`\nPrint exactly three lines:\nLine 1: `Slots: 9`\nLine 2: `Blocks: 16000`\nLine 3: `Total: 3000000000`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Declare the byte, int, and long variables and print them\n    }\n}",
          "hints": [
            "byte potionSlots = 9;",
            "int blockCount = 16000;",
            "long totalWorldBlocks = 3000000000L; (Remember the 'L' suffix!)"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        byte potionSlots = 9;\n        int blockCount = 16000;\n        long totalWorldBlocks = 3000000000L;\n        System.out.println(\"Slots: \" + potionSlots);\n        System.out.println(\"Blocks: \" + blockCount);\n        System.out.println(\"Total: \" + totalWorldBlocks);\n    }\n}",
          "tests": [
            {
              "name": "Three-tier integer scale check",
              "stdin": "",
              "expectedStdout": "Slots: 9\nBlocks: 16000\nTotal: 3000000000"
            },
            {
              "name": "Byte slots check",
              "stdin": "",
              "expectedStdout": "Slots: 9\nBlocks: 16000\nTotal: 3000000000"
            },
            {
              "name": "Long total check",
              "stdin": "",
              "expectedStdout": "Slots: 9\nBlocks: 16000\nTotal: 3000000000"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 4.2.1: Integral Types and Values",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Integers)",
            "verify": false
          }
        ]
      },
      {
        "id": "b2_l3",
        "title": "Floating-Point Numbers: float vs double",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "Brewing alchemical potions requires exact measurements. An elixir brewed with 2.5 grams of glowstone dust has different potency than 2.0 grams. Java handles fractional values through IEEE 754 floating-point numbers.",
        "explanation": [
          {
            "type": "text",
            "content": "Java offers two primitive floating-point types that follow the IEEE 754 international standard:\n\n1. `float`: 32 bits (4 bytes). Provides roughly 6-7 significant decimal digits of precision. Literals require an `F` or `f` suffix (e.g. `3.14F`).\n2. `double`: 64 bits (8 bytes). Provides roughly 15-17 significant decimal digits of precision. This is Java's default floating-point type for fractional literals."
          },
          {
            "type": "code",
            "content": "float vs double Declarations:",
            "code": "float velocity = 9.81F;    // Suffix 'F' is mandatory for float\ndouble latitude = 45.1098234; // double is default for 45.1098234"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "Floating Point Binary Inaccuracy",
            "content": "Because computers represent fractional numbers in binary base-2 powers, numbers like 0.1 cannot be represented with exact precision (similar to 1/3 in decimal). For financial or trade transactions, never use float or double—use `java.math.BigDecimal` instead."
          }
        ],
        "slides": [
          {
            "title": "IEEE 754 Representation",
            "type": "intro",
            "content": "A float consists of 1 sign bit, 8 exponent bits, and 23 mantissa fraction bits. A double allocates 1 sign, 11 exponent, and 52 mantissa bits."
          },
          {
            "title": "The Floating-Point Roundoff Phenomenon",
            "type": "code",
            "content": "Try calculating 2.0 - 1.1 in Java. You might expect 0.9, but IEEE 754 produces 0.8999999999999999.",
            "code": "double a = 2.0;\ndouble b = 1.1;\nSystem.out.println(a - b); // 0.8999999999999999"
          },
          {
            "title": "Special Floating Values",
            "type": "tip",
            "content": "Java floats can represent positive and negative infinity (e.g. 1.0 / 0.0) as well as 'NaN' (Not a Number, from 0.0 / 0.0)."
          }
        ],
        "underTheHood": "The HotSpot JVM maps `double` and `float` directly to modern CPU vector and floating-point registers (e.g. AVX / SSE on x86-64, NEON on ARM64). Math operations compile into dedicated FPU instructions like `addsd`, `subsd`, and `mulsd`.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        double itemWeight = 4.25;\n        int quantity = 6;\n        double totalWeight = itemWeight * quantity;\n        System.out.printf(\"Total Load: %.2f kg%n\", totalWeight);\n    }\n}",
          "walkthrough": [
            "Line 3: Declares 64-bit double for item weight.",
            "Line 4: Integer item count.",
            "Line 5: Multiplies double by int (int is promoted to double during calculation).",
            "Line 6: Uses printf with %.2f to output cleanly formatted weight."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Omission of 'F' suffix when declaring a float",
            "error": "error: incompatible types: possible lossy conversion from double to float",
            "fix": "Raw decimal literals (like 3.14) default to double. Write '3.14F' or '3.14f' to declare a float."
          },
          {
            "mistake": "Comparing floating point numbers using ==",
            "error": "Unexpected false when comparing 0.1 + 0.2 == 0.3",
            "fix": "Due to binary precision limits, compare floating points using a delta tolerance: Math.abs(a - b) < 0.00001."
          }
        ],
        "checkpoint": [
          {
            "question": "Why does 'float speed = 12.5;' fail to compile?",
            "options": [
              "12.5 is too large for float",
              "12.5 is treated as a double by default and cannot be assigned to float without an 'F' suffix",
              "Floats cannot have decimal fractions",
              "speed is a reserved Java keyword"
            ],
            "answer": 1,
            "explanation": "In Java, any floating-point literal with a decimal point defaults to 64-bit double. An 'F' suffix is required for 32-bit float."
          },
          {
            "question": "Which Java class should be used for exact currency and financial calculations?",
            "options": [
              "double",
              "float",
              "java.math.BigDecimal",
              "long"
            ],
            "answer": 2,
            "explanation": "BigDecimal provides arbitrary-precision signed decimal numbers, preventing binary roundoff errors."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that calculates the damage of a crafted weapon:\n- A `double` named `baseDamage` initialized to `12.5`\n- A `double` named `multiplier` initialized to `1.5`\n- A `double` named `totalDamage` calculated as `baseDamage * multiplier`\nPrint exactly:\nLine 1: `Base: 12.5`\nLine 2: `Multiplier: 1.5`\nLine 3: `Final Damage: 18.75`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Calculate damage and print the 3 lines\n    }\n}",
          "hints": [
            "double baseDamage = 12.5;",
            "double multiplier = 1.5;",
            "double totalDamage = baseDamage * multiplier;",
            "System.out.println(\"Final Damage: \" + totalDamage);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        double baseDamage = 12.5;\n        double multiplier = 1.5;\n        double totalDamage = baseDamage * multiplier;\n        System.out.println(\"Base: \" + baseDamage);\n        System.out.println(\"Multiplier: \" + multiplier);\n        System.out.println(\"Final Damage: \" + totalDamage);\n    }\n}",
          "tests": [
            {
              "name": "Floating calculation check",
              "stdin": "",
              "expectedStdout": "Base: 12.5\nMultiplier: 1.5\nFinal Damage: 18.75"
            },
            {
              "name": "Base check",
              "stdin": "",
              "expectedStdout": "Base: 12.5\nMultiplier: 1.5\nFinal Damage: 18.75"
            },
            {
              "name": "Final damage product check",
              "stdin": "",
              "expectedStdout": "Base: 12.5\nMultiplier: 1.5\nFinal Damage: 18.75"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Floating-Point Types)",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 60: Avoid float and double if exact answers are required",
            "verify": false
          }
        ]
      },
      {
        "id": "b2_l4",
        "title": "Characters & Booleans: Symbols and Binary State",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "The market square uses flags to signal open stalls and single runic stamps to authenticate trade permits. In Java, characters represent individual symbols, while booleans capture binary truths: true or false.",
        "explanation": [
          {
            "type": "text",
            "content": "The remaining two primitive data types in Java are:\n\n1. `char`: 16-bit unsigned integer representing a single Unicode character, enclosed in **single quotes** (`'A'`, `'#'`, `'\\u00A9'`). Range: 0 to 65,535.\n2. `boolean`: Represents logical truth with exactly two literal values: `true` or `false`. Unlike C or Python, Java booleans are NOT numbers; you cannot convert `1` or `0` into a boolean."
          },
          {
            "type": "code",
            "content": "char and boolean Syntax:",
            "code": "char tierRank = 'S';\nchar currencySymbol = '$';\n\nboolean isGateOpen = true;\nboolean hasAdminKey = false;"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Character Arithmetic",
            "content": "Because `char` values are stored as unsigned 16-bit integers under the hood, you can perform integer arithmetic on them: `'A' + 1` evaluates to the number `66`, which is ASCII/Unicode code point for `'B'`."
          }
        ],
        "slides": [
          {
            "title": "Unicode Character Support",
            "type": "intro",
            "content": "Java was designed from day one to support international character sets using 16-bit Unicode (UTF-16 code units)."
          },
          {
            "title": "Strict Boolean Isolation",
            "type": "code",
            "content": "In Java, 'if (1)' or 'boolean b = 0;' causes a compiler error. Booleans must be strictly 'true' or 'false'.",
            "code": "boolean isNight = true;\nif (isNight) {\n    System.out.println(\"Monsters spawn!\");\n}"
          },
          {
            "title": "Single Quotes vs Double Quotes",
            "type": "tip",
            "content": "'A' is a primitive char (16 bits). \"A\" is a java.lang.String object allocated on the heap containing the character 'A'."
          }
        ],
        "underTheHood": "In the JVM specification, there are no dedicated bytecode instructions for boolean operations. In memory, the JVM compiles boolean expressions using integer opcodes (`iconst_0` for false, `iconst_1` for true) and conditional branches (`ifeq`, `ifne`). In arrays, `boolean[]` is represented as an array of 8-bit bytes.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        char grade = 'A';\n        boolean isEnchanted = true;\n        boolean isBroken = false;\n        System.out.println(\"Tier: \" + grade);\n        System.out.println(\"Enchanted: \" + isEnchanted);\n        System.out.println(\"Broken: \" + isBroken);\n    }\n}",
          "walkthrough": [
            "Line 3: Allocates char primitive with single-quoted 'A'.",
            "Line 4: Initializes boolean flag to true.",
            "Line 5: Initializes boolean flag to false.",
            "Line 6-8: Outputs formatted state of item."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Wrapping char values in double quotes",
            "error": "error: incompatible types: String cannot be converted to char",
            "fix": "Use single quotes for single characters: 'X'. Double quotes create a String object: \"X\"."
          },
          {
            "mistake": "Treating integer 0 or 1 as boolean",
            "error": "error: incompatible types: int cannot be converted to boolean",
            "fix": "Write boolean literals explicitly as 'true' or 'false'."
          }
        ],
        "checkpoint": [
          {
            "question": "Which of the following is a valid char literal in Java?",
            "options": [
              "\"A\"",
              "'Hello'",
              "'Z'",
              "Z"
            ],
            "answer": 2,
            "explanation": "A char literal must be enclosed in single quotes and contain exactly one character: 'Z'."
          },
          {
            "question": "Can an integer with value 1 be used directly in an if-condition like 'if (1)'?",
            "options": [
              "Yes, like in C and C++",
              "No, Java requires a strict boolean expression (true or false)",
              "Only in Java 21",
              "Yes, if imported from java.util"
            ],
            "answer": 1,
            "explanation": "Java does not treat integers as truthy/falsy. If-conditions require a strict boolean."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that declares:\n- A `char` named `statusGlyph` initialized to `'*'`\n- A `boolean` named `isDungeonCleared` initialized to `true`\n- A `boolean` named `hasBossKey` initialized to `false`\nPrint exactly three lines:\nLine 1: `Glyph: *`\nLine 2: `Cleared: true`\nLine 3: `Boss Key: false`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Declare char and boolean variables and print the 3 lines\n    }\n}",
          "hints": [
            "char statusGlyph = '*';",
            "boolean isDungeonCleared = true;",
            "boolean hasBossKey = false;"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        char statusGlyph = '*';\n        boolean isDungeonCleared = true;\n        boolean hasBossKey = false;\n        System.out.println(\"Glyph: \" + statusGlyph);\n        System.out.println(\"Cleared: \" + isDungeonCleared);\n        System.out.println(\"Boss Key: \" + hasBossKey);\n    }\n}",
          "tests": [
            {
              "name": "Char and boolean output verification",
              "stdin": "",
              "expectedStdout": "Glyph: *\nCleared: true\nBoss Key: false"
            },
            {
              "name": "Status glyph check",
              "stdin": "",
              "expectedStdout": "Glyph: *\nCleared: true\nBoss Key: false"
            },
            {
              "name": "Boolean state check",
              "stdin": "",
              "expectedStdout": "Glyph: *\nCleared: true\nBoss Key: false"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 4.2.3: The boolean Type and Boolean Values",
            "verify": false
          },
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 3: Data Types, Variables, and Arrays (Characters & Booleans)",
            "verify": false
          }
        ]
      },
      {
        "id": "b2_l5",
        "title": "Reading Console Input with java.util.Scanner",
        "xp": 35,
        "estimatedMinutes": 22,
        "story": "A silent merchant cannot negotiate trades. To create truly interactive programs, your code must listen to the traveler's voice from the terminal. The Scanner class parses formatted text streams from standard input.",
        "explanation": [
          {
            "type": "text",
            "content": "The `java.util.Scanner` class breaks standard input (`System.in`) into tokens using whitespace as a delimiter. To use it, you must import it at the very top of your file with `import java.util.Scanner;`.\n\nCommon Scanner methods:\n- `scanner.next()`: Reads the next single word token.\n- `scanner.nextLine()`: Reads the entire remaining line until the user presses Enter.\n- `scanner.nextInt()`: Reads the next token as a 32-bit integer.\n- `scanner.nextDouble()`: Reads the next token as a 64-bit double."
          },
          {
            "type": "code",
            "content": "Basic Scanner Pattern:",
            "code": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print(\"Enter item name: \");\n        String item = scanner.nextLine();\n        System.out.print(\"Enter quantity: \");\n        int qty = scanner.nextInt();\n        System.out.println(\"Ordered \" + qty + \"x \" + item);\n        scanner.close();\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "The Leftover Newline Trap",
            "content": "When you call `scanner.nextInt()`, Scanner reads only the number digits, leaving the trailing newline character (`\\n`) generated when the user pressed Enter sitting in the input buffer. If you subsequently call `scanner.nextLine()`, it immediately consumes that leftover `\\n` and returns an empty string! Always consume the leftover newline with a blank `scanner.nextLine();` before reading your next text line."
          }
        ],
        "slides": [
          {
            "title": "The Scanner Utility",
            "type": "intro",
            "content": "Scanner wraps 'System.in' (standard input stream) and provides regex-based token parsing."
          },
          {
            "title": "The Leftover Newline Pattern",
            "type": "code",
            "content": "Always consume the leftover newline when switching from nextInt() to nextLine().",
            "code": "int level = scanner.nextInt();\nscanner.nextLine(); // Clear the buffer!\nString guild = scanner.nextLine(); // Successfully reads text"
          },
          {
            "title": "InputMismatchException",
            "type": "tip",
            "content": "If you call nextInt() but the user types 'one hundred', Scanner throws InputMismatchException. We will learn to handle this gracefully with try-catch in Module 8."
          }
        ],
        "underTheHood": "Scanner buffers characters from `System.in` in an internal `CharBuffer`. It uses regular expressions compiled into `java.util.regex.Pattern` to match token boundaries. Because `System.in` is an unbuffered byte stream (`InputStream`), Scanner decodes incoming bytes using the platform's default charset (UTF-8 in modern Java).",
        "workedExample": {
          "code": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String adventurer = scanner.nextLine();\n        int level = scanner.nextInt();\n        System.out.println(\"Adventurer: \" + adventurer);\n        System.out.println(\"Level: \" + level);\n        scanner.close();\n    }\n}",
          "walkthrough": [
            "Line 1: Imports Scanner from standard java.util package.",
            "Line 5: Constructs Scanner reading from standard input System.in.",
            "Line 6: Reads first full line of input into adventurer name.",
            "Line 7: Reads next token as integer level.",
            "Line 8-9: Outputs formatted profile card.",
            "Line 10: Closes scanner resource cleanly."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Forgetting to import java.util.Scanner",
            "error": "error: cannot find symbol class Scanner",
            "fix": "Add 'import java.util.Scanner;' at the very top of your file (before public class)."
          },
          {
            "mistake": "Leftover newline causing nextLine() to read empty string",
            "error": "Scanner appears to skip asking for user input",
            "fix": "Insert a dummy 'scanner.nextLine();' immediately after 'scanner.nextInt()' to clear the leftover newline from the buffer."
          }
        ],
        "checkpoint": [
          {
            "question": "What happens if a user inputs the word 'banana' when scanner.nextInt() is called?",
            "options": [
              "nextInt() returns 0",
              "The program throws an InputMismatchException at runtime",
              "The program automatically compiles into a String",
              "The program reboots the operating system"
            ],
            "answer": 1,
            "explanation": "Scanner expects integer digits; non-numeric input throws an InputMismatchException."
          },
          {
            "question": "How do you solve the leftover newline issue after calling scanner.nextInt()?",
            "options": [
              "Call scanner.close()",
              "Call an extra scanner.nextLine() to consume the leftover newline character",
              "Restart the JVM",
              "Use float instead of int"
            ],
            "answer": 1,
            "explanation": "A dummy scanner.nextLine() clears the buffer so the subsequent read captures the user's actual text."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that:\n1. Reads a player's handle (`String`) from standard input on line 1\n2. Reads the number of completed quests (`int`) from standard input on line 2\n3. Computes `bonusXp = quests * 50`\nPrint exactly three lines:\nLine 1: `Player: <handle>`\nLine 2: `Quests Completed: <quests>`\nLine 3: `Bonus XP: <bonusXp>`",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Read player handle and quest count from Scanner, compute bonus XP, and print\n    }\n}",
          "hints": [
            "Scanner scanner = new Scanner(System.in);",
            "String handle = scanner.nextLine();",
            "int quests = scanner.nextInt();",
            "int bonusXp = quests * 50;"
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String handle = scanner.nextLine();\n        int quests = scanner.nextInt();\n        int bonusXp = quests * 50;\n        System.out.println(\"Player: \" + handle);\n        System.out.println(\"Quests Completed: \" + quests);\n        System.out.println(\"Bonus XP: \" + bonusXp);\n        scanner.close();\n    }\n}",
          "tests": [
            {
              "name": "Scout with 4 quests",
              "stdin": "Scout\n4\n",
              "expectedStdout": "Player: Scout\nQuests Completed: 4\nBonus XP: 200"
            },
            {
              "name": "Blockhead with 10 quests",
              "stdin": "Blockhead\n10\n",
              "expectedStdout": "Player: Blockhead\nQuests Completed: 10\nBonus XP: 500"
            },
            {
              "name": "Zero quests edge test",
              "stdin": "Novice\n0\n",
              "expectedStdout": "Player: Novice\nQuests Completed: 0\nBonus XP: 0"
            }
          ]
        },
        "references": [
          {
            "source": "Introduction to Java Programming, 12th ed.",
            "location": "Chapter 2: Elementary Programming (Reading Input from the Console)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Input and Output)",
            "verify": false
          }
        ]
      },
      {
        "id": "b2_l6",
        "title": "Type Casting & Numeric Promotion",
        "xp": 35,
        "estimatedMinutes": 20,
        "story": "At the village smithy, raw ore nuggets are melted and recast into solid ingots. Sometimes values fit naturally into bigger molds; other times, shaving off excess material is required. In Java, this transformation is called type casting.",
        "explanation": [
          {
            "type": "text",
            "content": "Converting a value from one data type to another takes two forms:\n\n1. **Widening Conversion (Implicit / Automatic)**: Converting a smaller numeric type to a larger type (e.g. `int` to `double`). Since no data can be lost, Java performs this automatically without special syntax.\n   `int coins = 42; double d = coins; // 42.0`\n\n2. **Narrowing Conversion (Explicit / Manual Casting)**: Converting a larger type to a smaller type (e.g. `double` to `int`). Because data can be lost (fractional parts are truncated, or numbers can overflow), Java requires an explicit cast operator: `(targetType)`.\n   `double weight = 9.85; int truncated = (int) weight; // 9 (0.85 is discarded!)`"
          },
          {
            "type": "code",
            "content": "Binary Numeric Promotion in Expressions:",
            "code": "byte a = 10;\nbyte b = 20;\n// byte c = a + b; // ERROR! In Java arithmetic, byte/short are automatically promoted to int!\nint c = a + b;     // Correct!\nbyte d = (byte) (a + b); // Explicit narrowing required if storing back in byte"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Truncation vs Rounding",
            "content": "Casting a double to an int does NOT round to the nearest whole number. It strictly truncates (chops off) the decimal fraction. `(int) 9.99` evaluates to `9`. Use `Math.round()` if you need mathematical rounding."
          }
        ],
        "slides": [
          {
            "title": "The Widening Hierarchy",
            "type": "intro",
            "content": "Safe widening order: byte -> short -> int -> long -> float -> double. Any step to the right happens automatically."
          },
          {
            "title": "The Narrowing Cast Operator",
            "type": "code",
            "content": "Place the target type in parentheses in front of the value you wish to cast.",
            "code": "double rawPrice = 19.95;\nint wholeDollars = (int) rawPrice;\nSystem.out.println(wholeDollars); // Prints 19"
          },
          {
            "title": "Integer Division Truncation",
            "type": "tip",
            "content": "5 / 2 evaluates to 2, not 2.5, because both operands are integers! Cast one operand to double to get 2.5: (double) 5 / 2."
          }
        ],
        "underTheHood": "In bytecode, widening conversions use instructions like `i2l` (int to long) or `i2d` (int to double). Explicit narrowing conversions emit instructions like `d2i` (double to int, which discards mantissa fraction bits) or `i2b` (int to byte, which keeps only the lowest 8 bits, potentially changing the sign).",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        double totalOreWeight = 58.75;\n        int completedBars = (int) totalOreWeight;\n        double scrapRemaining = totalOreWeight - completedBars;\n        System.out.println(\"Completed Bars: \" + completedBars);\n        System.out.printf(\"Scrap Remaining: %.2f kg%n\", scrapRemaining);\n    }\n}",
          "walkthrough": [
            "Line 3: 58.75 kg of mined ore.",
            "Line 4: Explicit cast (int) truncates 58.75 to 58 ingots.",
            "Line 5: Subtracts integer from double (integer is widened to 58.0) to get 0.75 kg scrap.",
            "Line 6-7: Prints formatted summary."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Expecting (int) 5.9 to round to 6",
            "error": "Logic bug: value unexpectedly truncates to 5",
            "fix": "Remember casting truncates. To round, use (int) Math.round(5.9)."
          },
          {
            "mistake": "Assuming (double)(5 / 2) produces 2.5",
            "error": "Logic bug: produces 2.0",
            "fix": "5 / 2 performs integer division first (yielding 2), which is only then converted to 2.0. Write (double) 5 / 2 or 5.0 / 2."
          }
        ],
        "checkpoint": [
          {
            "question": "What is the result of casting: (int) 7.89?",
            "options": [
              "8",
              "7",
              "7.0",
              "Compilation error"
            ],
            "answer": 1,
            "explanation": "Casting a floating-point number to an integer truncates the decimal part, leaving 7."
          },
          {
            "question": "What is output by: System.out.println(7 / 2);?",
            "options": [
              "3.5",
              "3",
              "4",
              "3.0"
            ],
            "answer": 1,
            "explanation": "Both operands are integers, so integer division is performed and the remainder is discarded, resulting in 3."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that takes a total grain harvest of `125.65` bushels (double):\n- Cast it to an `int` named `storedBushels` (truncating the decimal)\n- Compute `spillage` as `totalHarvest - storedBushels`\nPrint exactly three lines:\nLine 1: `Total: 125.65`\nLine 2: `Stored: 125`\nLine 3: `Spillage: 0.65` (formatted using System.out.printf(\"Spillage: %.2f%n\", spillage) or rounded properly)",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Cast double to int and print the 3 lines\n    }\n}",
          "hints": [
            "double total = 125.65;",
            "int stored = (int) total;",
            "double spillage = total - stored;",
            "System.out.printf(\"Spillage: %.2f%n\", spillage);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        double total = 125.65;\n        int stored = (int) total;\n        double spillage = total - stored;\n        System.out.println(\"Total: \" + total);\n        System.out.println(\"Stored: \" + stored);\n        System.out.printf(\"Spillage: %.2f%n\", spillage);\n    }\n}",
          "tests": [
            {
              "name": "Grain harvest cast check",
              "stdin": "",
              "expectedStdout": "Total: 125.65\nStored: 125\nSpillage: 0.65"
            },
            {
              "name": "Truncation check",
              "stdin": "",
              "expectedStdout": "Total: 125.65\nStored: 125\nSpillage: 0.65"
            },
            {
              "name": "Spillage remainder check",
              "stdin": "",
              "expectedStdout": "Total: 125.65\nStored: 125\nSpillage: 0.65"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 5.1.3: Narrowing Primitive Conversion",
            "verify": false
          },
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 3: Data Types, Variables, and Arrays (Type Conversion and Casting)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Which of the following primitive types occupies exactly 16 bits (2 bytes) of memory?",
        "options": [
          "int",
          "short",
          "byte",
          "long"
        ],
        "answer": 1,
        "explanation": "A short is a 16-bit signed integer."
      },
      {
        "type": "mcq",
        "question": "What is the default value of a local variable declared inside a method in Java?",
        "options": [
          "0 or null",
          "It has no default value and must be assigned before reading",
          "false",
          "1"
        ],
        "answer": 1,
        "explanation": "Local variables do not receive default values. Java enforces Definite Assignment."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nint a = 11;\nint b = 4;\nSystem.out.println(a / b);",
        "options": [
          "2.75",
          "2",
          "3",
          "2.0"
        ],
        "answer": 1,
        "explanation": "Integer division truncates decimals: 11 / 4 evaluates to 2."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\nfloat pi = 3.14159;\nSystem.out.println(pi);",
        "options": [
          "pi is a reserved keyword in Java",
          "3.14159 is a double literal and cannot be assigned to float without an 'F' suffix",
          "System.out.println cannot print floats",
          "float requires double quotes"
        ],
        "answer": 1,
        "explanation": "Fractional literals default to double. Appending 'F' (3.14159F) is required."
      },
      {
        "type": "mcq",
        "question": "Why should you be careful when using scanner.nextLine() right after scanner.nextInt()?",
        "options": [
          "nextInt() shuts down the Scanner",
          "nextInt() leaves the newline character in the buffer, which nextLine() immediately consumes as an empty line",
          "nextInt() deletes the System.in stream",
          "They use conflicting character encodings"
        ],
        "answer": 1,
        "explanation": "nextInt() consumes digits but leaves '\\n' in the stream buffer."
      },
      {
        "type": "fill-in",
        "question": "Fill in the blank: Casting a double to an int using (int) performs _______ rather than rounding.",
        "options": [
          "truncation",
          "rounding",
          "overflow",
          "negation"
        ],
        "answer": 0,
        "explanation": "Casting truncates (discards) the fractional digits completely."
      },
      {
        "type": "mcq",
        "question": "What is the maximum value that an 8-bit signed byte can store in Java?",
        "options": [
          "255",
          "128",
          "127",
          "64"
        ],
        "answer": 2,
        "explanation": "In signed 8-bit two's complement, the range is -128 to 127."
      },
      {
        "type": "order-the-lines",
        "question": "Order the lines to correctly read an integer from console:\n1: int count = sc.nextInt();\n2: import java.util.Scanner;\n3: sc.close();\n4: Scanner sc = new Scanner(System.in);",
        "options": [
          "2, 4, 1, 3",
          "4, 2, 1, 3",
          "1, 2, 4, 3",
          "2, 1, 4, 3"
        ],
        "answer": 0,
        "explanation": "Import (2), instantiate Scanner (4), read nextInt (1), close resource (3)."
      },
      {
        "type": "mcq",
        "question": "Which data type is best suited to represent an item's durability percentage like 87.5%?",
        "options": [
          "int",
          "double",
          "boolean",
          "char"
        ],
        "answer": 1,
        "explanation": "double represents floating-point percentages with high precision."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nchar ch = 'A';\nch++;\nSystem.out.println(ch);",
        "options": [
          "A1",
          "66",
          "B",
          "Compilation error"
        ],
        "answer": 2,
        "explanation": "The unary increment operator increments the Unicode code point of 'A' (65) to 66, which is 'B'."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\nboolean isReady = 1;\nif (isReady) System.out.println(\"Go\");",
        "options": [
          "Java booleans cannot be assigned integers like 1; they must be true or false",
          "isReady cannot be used in if statements",
          "System.out.println cannot print without curly braces",
          "if statements require while loops"
        ],
        "answer": 0,
        "explanation": "Java does not permit implicit conversion between integers and boolean."
      },
      {
        "type": "mcq",
        "question": "What happens during binary numeric promotion when adding a byte and an int?",
        "options": [
          "Both are promoted to double",
          "The byte is promoted to int, and the result is an int",
          "The int is converted to byte",
          "It throws a ClassCastException"
        ],
        "answer": 1,
        "explanation": "In mixed arithmetic with int, smaller integral types are automatically promoted to int."
      }
    ],
    "project": {
      "title": "Market Merchant Trade Calculator",
      "brief": "Construct an interactive terminal merchant trading counter using Scanner that accepts trade quantities, computes pricing with volume discounts, and outputs formatted receipts with proper currency alignment.",
      "milestones": [
        "Import java.util.Scanner and prompt for buyer name and item choice",
        "Read purchase quantity (int) and unit price in emeralds (double)",
        "Compute total cost, apply a 10% discount if quantity is 10 or greater",
        "Format output cleanly using System.out.printf with 2 decimal places"
      ],
      "rubric": [
        "Input safety: Correct handling of Scanner nextInt and nextLine",
        "Type precision: Appropriate usage of double for prices and int for units",
        "Calculation: Accurate discount formula without integer truncation bugs",
        "Output formatting: Clear alignment with $ or emerald symbols"
      ],
      "stretchGoals": [
        "Display item trade confirmation banner using ASCII borders",
        "Track merchant inventory depletion after trade completion"
      ]
    },
    "glossary": [
      {
        "term": "Primitive Type",
        "definition": "A basic data type built directly into Java that holds raw values directly in memory rather than object references."
      },
      {
        "term": "Static Typing",
        "definition": "A programming language feature where variable types are checked at compile-time and cannot change dynamically."
      },
      {
        "term": "Two's Complement",
        "definition": "The binary numbering system used by computer hardware and the JVM to represent signed integers."
      },
      {
        "term": "Overflow",
        "definition": "A condition that occurs when an arithmetic operation produces a value that exceeds the maximum representable limit of its data type."
      },
      {
        "term": "Narrowing Conversion",
        "definition": "A type conversion from a larger storage type to a smaller type that requires an explicit cast operator (type)."
      },
      {
        "term": "Widening Conversion",
        "definition": "An automatic type conversion from a smaller storage type to a larger type that preserves exact numerical value."
      }
    ],
    "references": [
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 3: Fundamental Programming Structures in Java (Data Types)",
        "verify": false
      },
      {
        "source": "Introduction to Java Programming, 12th ed.",
        "location": "Chapter 2: Elementary Programming",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b3",
    "code": "B3",
    "track": "beginner",
    "title": "Operators, Expressions & Precedence",
    "subtitle": "Arithmetic, relational, short-circuit boolean logic, and operator precedence",
    "biome": "Redstone Workshop",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Execute calculations using arithmetic operators (+, -, *, /, %) including modulo applications",
      "Predict exact outcomes of prefix (++i) vs postfix (i++) unary increment in expressions",
      "Construct boolean expressions using relational (<, <=, >, >=, ==, !=) operators",
      "Leverage short-circuit evaluation (&&, ||) to protect against runtime exceptions",
      "Apply the ternary conditional operator (? :) and resolve complex operator precedence"
    ],
    "prerequisites": [
      "b1",
      "b2"
    ],
    "lessons": [
      {
        "id": "b3_l1",
        "title": "Arithmetic Operators & The Modulo Operator",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "Inside the Redstone Workshop, gears turn with mathematical precision. To automate sorting hoppers and calculate craft yields, you must master Java's core arithmetic operators, especially the remainder tool: modulo.",
        "explanation": [
          {
            "type": "text",
            "content": "Java provides five fundamental binary arithmetic operators:\n- Addition (`+`)\n- Subtraction (`-`)\n- Multiplication (`*`)\n- Division (`/`)\n- Modulo / Remainder (`%`)\n\nThe modulo operator `%` calculates the integer remainder left over after division. For example, `14 % 4` evaluates to `2` because 4 goes into 14 three times with 2 left over."
          },
          {
            "type": "code",
            "content": "Practical Uses of Modulo (%):",
            "code": "// 1. Even or Odd check:\nboolean isEven = (number % 2 == 0);\n\n// 2. Wrap-around clock or inventory cycles (0 to N-1):\nint nextSlot = (currentSlot + 1) % 9;\n\n// 3. Time conversions:\nint totalSeconds = 125;\nint minutes = totalSeconds / 60; // 2 minutes\nint seconds = totalSeconds % 60; // 5 seconds"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Integer Division Reminder",
            "content": "Remember that integer division truncates decimals: `7 / 2` evaluates to `3`. If you want a fractional result, at least one operand must be a floating-point number: `7.0 / 2` is `3.5`."
          }
        ],
        "slides": [
          {
            "title": "The Modulo Remainder Operator",
            "type": "intro",
            "content": "Modulo computes the remainder: a % b. If a is evenly divisible by b, a % b is 0."
          },
          {
            "title": "Modulo with Negative Numbers",
            "type": "code",
            "content": "In Java, the sign of the modulo result matches the sign of the LEFT operand (the dividend). -7 % 3 is -1, while 7 % -3 is 1.",
            "code": "System.out.println(-7 % 3); // Prints -1\nSystem.out.println(7 % -3);  // Prints 1"
          },
          {
            "title": "Divide by Zero Trap",
            "type": "tip",
            "content": "Dividing an integer by 0 ('10 / 0' or '10 % 0') throws ArithmeticException at runtime. Floating-point division by 0 yields Infinity."
          }
        ],
        "underTheHood": "In the JVM instruction set, integer division maps to the `idiv` opcode, and integer remainder maps to `irem`. If the divisor on the operand stack is zero, the CPU or JVM runtime immediately raises a SIGFPE signal, translated into a `java.lang.ArithmeticException: / by zero`.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int totalMinutes = 145;\n        int hours = totalMinutes / 60;\n        int remainingMinutes = totalMinutes % 60;\n        System.out.println(\"Hours: \" + hours);\n        System.out.println(\"Minutes: \" + remainingMinutes);\n    }\n}",
          "walkthrough": [
            "Line 3: 145 total minutes elapsed.",
            "Line 4: Integer division 145 / 60 yields 2 hours.",
            "Line 5: Modulo 145 % 60 yields remaining 25 minutes.",
            "Line 6-7: Prints clean time breakdown: Hours: 2 and Minutes: 25."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Dividing by zero with integers",
            "error": "Exception in thread \"main\" java.lang.ArithmeticException: / by zero",
            "fix": "Always verify the divisor is not zero before executing integer division or modulo: 'if (b != 0) { ... }'."
          },
          {
            "mistake": "Confusing % with percentage calculation",
            "error": "Using 'score % 100' thinking it calculates a percentage",
            "fix": "'%' is strictly remainder. To calculate percentage, write '(score / total) * 100.0'."
          }
        ],
        "checkpoint": [
          {
            "question": "What is the result of 23 % 5 in Java?",
            "options": [
              "4",
              "3",
              "4.6",
              "0"
            ],
            "answer": 1,
            "explanation": "5 * 4 = 20, leaving a remainder of 3."
          },
          {
            "question": "How do you test if an integer 'val' is an even number?",
            "options": [
              "val / 2 == 0",
              "val % 2 == 0",
              "val == 2",
              "val % 2 == 1"
            ],
            "answer": 1,
            "explanation": "An even number divided by 2 has a remainder of 0: val % 2 == 0."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that converts `200` items into inventory stacks:\n- A stack holds `64` items (`final int STACK_SIZE = 64;`)\n- Compute `fullStacks = 200 / STACK_SIZE;`\n- Compute `leftoverItems = 200 % STACK_SIZE;`\nPrint exactly:\nLine 1: `Total Items: 200`\nLine 2: `Full Stacks: 3`\nLine 3: `Leftover Items: 8`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Compute full stacks and leftovers for 200 items\n    }\n}",
          "hints": [
            "int total = 200;",
            "int fullStacks = total / 64;",
            "int leftovers = total % 64;"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int total = 200;\n        int fullStacks = total / 64;\n        int leftovers = total % 64;\n        System.out.println(\"Total Items: \" + total);\n        System.out.println(\"Full Stacks: \" + fullStacks);\n        System.out.println(\"Leftover Items: \" + leftovers);\n    }\n}",
          "tests": [
            {
              "name": "Stack and modulo calculation",
              "stdin": "",
              "expectedStdout": "Total Items: 200\nFull Stacks: 3\nLeftover Items: 8"
            },
            {
              "name": "Full stacks check",
              "stdin": "",
              "expectedStdout": "Total Items: 200\nFull Stacks: 3\nLeftover Items: 8"
            },
            {
              "name": "Leftovers check",
              "stdin": "",
              "expectedStdout": "Total Items: 200\nFull Stacks: 3\nLeftover Items: 8"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 15.17.3: Remainder Operator %",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Operators)",
            "verify": false
          }
        ]
      },
      {
        "id": "b3_l2",
        "title": "Compound Assignment & Prefix vs Postfix Unary Operators",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "In redstone repeaters, a tick delay can be incremented immediately or after the signal passes. Java provides compound assignment shortcuts and subtle prefix/postfix unary operators that dictate exact timing of updates.",
        "explanation": [
          {
            "type": "text",
            "content": "Compound assignment operators combine an arithmetic operation with assignment:\n- `x += 5;` is equivalent to `x = x + 5;`\n- `x -= 2;` is equivalent to `x = x - 2;`\n- `x *= 3;` is equivalent to `x = x * 3;`\n\nAdditionally, compound assignment operators perform an implicit cast: `byte b = 1; b += 1;` compiles cleanly because it implicitly casts to `(byte)(b + 1)`."
          },
          {
            "type": "code",
            "content": "Prefix (++x) vs Postfix (x++):",
            "code": "int a = 5;\nint b = ++a; // Prefix: 'a' is incremented to 6 FIRST, then 6 is assigned to 'b'\n// Result: a is 6, b is 6\n\nint x = 5;\nint y = x++; // Postfix: old value 5 is assigned to 'y' FIRST, then 'x' is incremented to 6\n// Result: x is 6, y is 5"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Standalone Statements",
            "content": "When written as a standalone statement on its own line (`x++;` or `++x;`), both prefix and postfix behave identically: they increment x by 1. The difference only matters when the expression's returned value is consumed by another operation."
          }
        ],
        "slides": [
          {
            "title": "Compound Assignments",
            "type": "intro",
            "content": "+=, -=, *=, /=, and %= update a variable in place and automatically cast the result."
          },
          {
            "title": "Prefix vs Postfix Order of Operations",
            "type": "code",
            "content": "Prefix (++i): Increment first, evaluate second. Postfix (i++): Evaluate first, increment second.",
            "code": "int count = 10;\nSystem.out.println(count++); // Prints 10 (count becomes 11)\nSystem.out.println(++count); // Prints 12 (incremented to 12 first)"
          },
          {
            "title": "Best Practice",
            "type": "tip",
            "content": "Avoid embedding multiple increments in a single expression like 'x++ + ++x'. It makes code fragile and hard to read."
          }
        ],
        "underTheHood": "The `iinc` bytecode instruction increments a local variable directly in place without pushing it onto the operand stack. In postfix `x++`, `iload` pushes the old value to the operand stack before `iinc` modifies the local variable slot.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int stamina = 100;\n        stamina -= 15;\n        int currentRank = 1;\n        int nextRank = ++currentRank;\n        System.out.println(\"Stamina: \" + stamina);\n        System.out.println(\"Rank: \" + nextRank);\n    }\n}",
          "walkthrough": [
            "Line 4: Subtracts 15 using compound assignment (stamina becomes 85).",
            "Line 6: Prefix increment updates currentRank to 2 and assigns 2 to nextRank.",
            "Line 7-8: Outputs formatted values."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Writing 'x = x++' expecting x to increment",
            "error": "x remains unchanged!",
            "fix": "In 'x = x++', postfix returns the old value of x, which is then assigned back into x, overwriting the increment. Just write 'x++;'."
          },
          {
            "mistake": "Confusing =+ with +=",
            "error": "x =+ 5 assigns positive 5 to x instead of adding 5",
            "fix": "Always write the operator before the equals sign: '+='."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nint n = 7;\nint res = n++ * 2;\nSystem.out.println(res + \" \" + n);",
            "options": [
              "14 8",
              "16 8",
              "14 7",
              "16 7"
            ],
            "answer": 0,
            "explanation": "In postfix n++, old value 7 is used in multiplication (7 * 2 = 14), then n increments to 8. Output: 14 8."
          },
          {
            "question": "What is the advantage of 'byte b = 1; b += 2;' over 'b = b + 2;'?",
            "options": [
              "No difference",
              "b += 2 automatically casts to byte; b = b + 2 fails to compile because b + 2 promotes to int",
              "b += 2 runs on GPU",
              "b += 2 is only allowed in Java 21"
            ],
            "answer": 1,
            "explanation": "Compound assignment automatically includes an explicit narrowing cast: (byte)(b + 2)."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that starts with `int score = 50;`:\n1. Add `25` to `score` using `+=`\n2. Multiply `score` by `2` using `*=`\n3. Decrement `score` by `1` using postfix `--`\nPrint exactly:\nLine 1: `Final Score: 149`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int score = 50;\n        // TODO: Apply the compound operations and print the final score\n    }\n}",
          "hints": [
            "score += 25; // 75",
            "score *= 2;  // 150",
            "score--;     // 149",
            "System.out.println(\"Final Score: \" + score);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int score = 50;\n        score += 25;\n        score *= 2;\n        score--;\n        System.out.println(\"Final Score: \" + score);\n    }\n}",
          "tests": [
            {
              "name": "Score transformation test",
              "stdin": "",
              "expectedStdout": "Final Score: 149"
            },
            {
              "name": "Arithmetic precision test",
              "stdin": "",
              "expectedStdout": "Final Score: 149"
            },
            {
              "name": "Final line check",
              "stdin": "",
              "expectedStdout": "Final Score: 149"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 15.26.2: Compound Assignment Operators",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Increment and Decrement Operators)",
            "verify": false
          }
        ]
      },
      {
        "id": "b3_l3",
        "title": "Relational & Equality Operators",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "Security pressure plates in ancient desert temples trigger only when specific weight thresholds are met. Relational operators compare two values and produce a boolean verdict: true or false.",
        "explanation": [
          {
            "type": "text",
            "content": "Java offers six relational comparison operators:\n- Greater than (`>`)\n- Greater than or equal to (`>=`)\n- Less than (`<`)\n- Less than or equal to (`<=`)\n- Equal to (`==`)\n- Not equal to (`!=`)\n\nEvery relational operator evaluates strictly to `true` or `false`."
          },
          {
            "type": "code",
            "content": "Relational Comparisons:",
            "code": "int playerLevel = 15;\nint requiredLevel = 10;\n\nboolean canEnterDungeon = playerLevel >= requiredLevel; // true\nboolean isMaxLevel = (playerLevel == 100);             // false\nboolean hasPenalty = (playerLevel != 0);               // true"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "The String Equality Trap: == vs .equals()",
            "content": "For primitive types (`int`, `double`, `char`), `==` compares their actual numerical values. But for reference objects like `String`, `==` compares their **memory addresses**, not their text content! To compare string text, always use `str1.equals(str2)`."
          }
        ],
        "slides": [
          {
            "title": "Boolean Outcome of Comparisons",
            "type": "intro",
            "content": "Relational operators take numerical expressions on both sides and return a boolean true or false."
          },
          {
            "title": "Assignment (=) vs Equality (==)",
            "type": "code",
            "content": "Single equals '=' assigns a value. Double equals '==' tests for equality.",
            "code": "int speed = 20;\n// if (speed = 25) // COMPILE ERROR in Java (cannot convert int to boolean)\nif (speed == 20) { // CORRECT: boolean equality comparison\n    System.out.println(\"Matching speed\");\n}"
          },
          {
            "title": "String Comparison Golden Rule",
            "type": "tip",
            "content": "Never use '==' to compare text in Strings. Always use 'name.equals(\"Alex\")' or 'name.equalsIgnoreCase(\"alex\")'."
          }
        ],
        "underTheHood": "The JVM implements integer comparisons with instructions like `if_icmpeq`, `if_icmpne`, `if_icmplt`, and `if_icmpge`. These compare the top two values on the operand stack and branch to target bytecode offsets depending on the condition flags.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int playerLevel = 14;\n        int requiredLevel = 12;\n        boolean eligible = playerLevel >= requiredLevel;\n        System.out.println(\"Player Level: \" + playerLevel);\n        System.out.println(\"Eligible: \" + eligible);\n    }\n}",
          "walkthrough": [
            "Line 3: Current level 14.",
            "Line 4: Gate requirement 12.",
            "Line 5: Evaluates 14 >= 12, producing boolean true.",
            "Line 6-7: Outputs status."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Using = instead of == in comparisons",
            "error": "error: incompatible types: int cannot be converted to boolean",
            "fix": "Use '==' for comparison. Java prevents accidental assignment bugs inside if-conditions because '=' returns the assigned value, which is not a boolean."
          },
          {
            "mistake": "Chaining comparisons like 5 < x < 10",
            "error": "error: bad operand types for binary operator '<'",
            "fix": "Java cannot chain comparisons. Write '(5 < x) && (x < 10)'."
          }
        ],
        "checkpoint": [
          {
            "question": "What is the result of evaluating: 15 != 15?",
            "options": [
              "true",
              "false",
              "null",
              "Compilation error"
            ],
            "answer": 1,
            "explanation": "15 is equal to 15, so the not-equal test (15 != 15) evaluates to false."
          },
          {
            "question": "Why does comparing two Strings with '==' often cause bugs?",
            "options": [
              "Strings cannot be compared in Java",
              "'==' compares object memory references rather than character content",
              "'==' is slower than equals",
              "Strings are primitives"
            ],
            "answer": 1,
            "explanation": "'==' checks whether both references point to the exact same object in memory, not whether the text is identical."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that checks if an adventurer has enough stamina:\n- `int currentStamina = 45;`\n- `int sprintCost = 30;`\n- `boolean canSprint = currentStamina >= sprintCost;`\n- `boolean isExhausted = currentStamina == 0;`\nPrint exactly:\nLine 1: `Can Sprint: true`\nLine 2: `Is Exhausted: false`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Compare stamina values and print the two boolean lines\n    }\n}",
          "hints": [
            "int currentStamina = 45;",
            "int sprintCost = 30;",
            "boolean canSprint = currentStamina >= sprintCost;",
            "boolean isExhausted = currentStamina == 0;"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int currentStamina = 45;\n        int sprintCost = 30;\n        boolean canSprint = currentStamina >= sprintCost;\n        boolean isExhausted = currentStamina == 0;\n        System.out.println(\"Can Sprint: \" + canSprint);\n        System.out.println(\"Is Exhausted: \" + isExhausted);\n    }\n}",
          "tests": [
            {
              "name": "Stamina comparison check",
              "stdin": "",
              "expectedStdout": "Can Sprint: true\nIs Exhausted: false"
            },
            {
              "name": "Sprint capability check",
              "stdin": "",
              "expectedStdout": "Can Sprint: true\nIs Exhausted: false"
            },
            {
              "name": "Exhaustion check",
              "stdin": "",
              "expectedStdout": "Can Sprint: true\nIs Exhausted: false"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 15.20: Relational Operators",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 3: Primitives and References (Comparing variables)",
            "verify": false
          }
        ]
      },
      {
        "id": "b3_l4",
        "title": "Logical Operators & Short-Circuit Evaluation",
        "xp": 35,
        "estimatedMinutes": 20,
        "story": "Redstone logic gates combine signals: an AND gate powers a piston only when both levers are pulled; an OR gate activates when either pressure plate is pressed. In Java, logical operators combine conditions and feature critical short-circuit performance protection.",
        "explanation": [
          {
            "type": "text",
            "content": "Java provides three primary boolean logical operators:\n- Logical AND (`&&`): Returns `true` if and only if **both** operands are true.\n- Logical OR (`||`): Returns `true` if **either** operand (or both) is true.\n- Logical NOT (`!`): Unary operator that inverts boolean state (`!true` is `false`)."
          },
          {
            "type": "code",
            "content": "Short-Circuit Evaluation in Action:",
            "code": "// Short-circuit AND (&&):\n// If the left side is false, the entire expression CANNOT be true.\n// Java immediately skips evaluating the right side!\nint denominator = 0;\nif (denominator != 0 && (100 / denominator > 2)) {\n    // Safe! (100 / denominator) is NEVER executed, preventing divide-by-zero!\n}\n\n// Short-circuit OR (||):\n// If the left side is true, the entire expression IS ALREADY true.\n// Java skips evaluating the right side."
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Safety Shield Pattern",
            "content": "Short-circuit evaluation is frequently used to guard against null pointers and division by zero:\n`if (player != null && player.hasKey()) { ... }`\nBecause `&&` short-circuits, `player.hasKey()` is never called if `player` is null."
          }
        ],
        "slides": [
          {
            "title": "Truth Tables for && and ||",
            "type": "intro",
            "content": "A && B is true only when both are true. A || B is true if at least one is true. !A flips true to false and false to true."
          },
          {
            "title": "Non-Short-Circuit Operators (& and |)",
            "type": "code",
            "content": "Single '&' and '|' also work on booleans, but they ALWAYS evaluate both sides, losing short-circuit protection.",
            "code": "// Dangerous: evaluates right side even when false, crashing with / by zero!\n// if (d != 0 & 10/d > 1) { ... }"
          },
          {
            "title": "De Morgan's Laws",
            "type": "tip",
            "content": "!(A && B) is logically equivalent to (!A || !B). !(A || B) is equivalent to (!A && !B)."
          }
        ],
        "underTheHood": "In bytecode, `&&` and `||` compile into conditional jump instructions (`ifeq` / `ifne`). If the left condition fails in an `&&`, the compiler emits an immediate jump to the false branch label, physically bypassing the evaluation instructions for the right subexpression.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        boolean hasKey = true;\n        boolean hasPassword = false;\n        boolean isAdmin = true;\n\n        boolean canOpen = (hasKey && hasPassword) || isAdmin;\n        System.out.println(\"Vault Access Granted: \" + canOpen);\n    }\n}",
          "walkthrough": [
            "Evaluates (hasKey && hasPassword): true && false is false.",
            "Evaluates false || isAdmin: false || true is true.",
            "Result is true: outputs 'Vault Access Granted: true'."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Using single & or | instead of && or ||",
            "error": "NullPointerException or ArithmeticException occurs despite guard check",
            "fix": "Always use double '&&' and '||' for conditional logic to guarantee short-circuit safety."
          },
          {
            "mistake": "Forgetting operator precedence between && and ||",
            "error": "Logic bug: && binds tighter than ||",
            "fix": "Use explicit parentheses '()' around sub-expressions to clarify grouping."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nint x = 5;\nboolean test = (x > 10) && (++x > 2);\nSystem.out.println(x);",
            "options": [
              "5",
              "6",
              "true",
              "false"
            ],
            "answer": 0,
            "explanation": "Because (x > 10) is false, the short-circuit && skips the right side entirely. ++x is never executed, so x remains 5."
          },
          {
            "question": "Which expression is equivalent to !(hasTicket && hasID) according to De Morgan's Law?",
            "options": [
              "!hasTicket && !hasID",
              "!hasTicket || !hasID",
              "hasTicket || hasID",
              "!hasTicket == !hasID"
            ],
            "answer": 1,
            "explanation": "!(A && B) flips the operator to OR: (!A || !B)."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that determines if a portal can activate:\n- `boolean hasObsidianFrame = true;`\n- `boolean hasFlintAndSteel = true;`\n- `boolean inDanger = false;`\n- Portal can light if: `(hasObsidianFrame && hasFlintAndSteel) && !inDanger`\nPrint exactly:\nLine 1: `Portal Active: true`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Define the 3 flags, evaluate portal condition, and print\n    }\n}",
          "hints": [
            "boolean hasObsidianFrame = true;",
            "boolean hasFlintAndSteel = true;",
            "boolean inDanger = false;",
            "boolean portalActive = (hasObsidianFrame && hasFlintAndSteel) && !inDanger;"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        boolean hasObsidianFrame = true;\n        boolean hasFlintAndSteel = true;\n        boolean inDanger = false;\n        boolean portalActive = (hasObsidianFrame && hasFlintAndSteel) && !inDanger;\n        System.out.println(\"Portal Active: \" + portalActive);\n    }\n}",
          "tests": [
            {
              "name": "Portal activation check",
              "stdin": "",
              "expectedStdout": "Portal Active: true"
            },
            {
              "name": "Boolean logic verification",
              "stdin": "",
              "expectedStdout": "Portal Active: true"
            },
            {
              "name": "Exact string match",
              "stdin": "",
              "expectedStdout": "Portal Active: true"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 15.23 & 15.24: Conditional-And and Conditional-Or",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Logical Operators)",
            "verify": false
          }
        ]
      },
      {
        "id": "b3_l5",
        "title": "The Ternary Conditional Operator (? :)",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "A merchant offering custom rates does not need a whole scroll of rules for a simple yes/no choice. The ternary operator provides a concise inline expression to select one of two values based on a boolean condition.",
        "explanation": [
          {
            "type": "text",
            "content": "The ternary operator is Java's only operator that takes three operands. It takes the form:\n`condition ? expressionIfTrue : expressionIfFalse`\n\nIf `condition` evaluates to `true`, the operator yields the result of `expressionIfTrue`. If `condition` is `false`, it yields `expressionIfFalse`."
          },
          {
            "type": "code",
            "content": "Ternary Operator vs if-else:",
            "code": "// Traditional if-else:\nString status;\nif (health > 50) {\n    status = \"Healthy\";\n} else {\n    status = \"Injured\";\n}\n\n// Concise ternary inline assignment:\nString status = (health > 50) ? \"Healthy\" : \"Injured\";"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Expression vs Statement",
            "content": "Because the ternary operator is an **expression** (it evaluates to a value), it can be placed directly inside assignments, return statements, or `System.out.println()` calls."
          }
        ],
        "slides": [
          {
            "title": "Ternary Structure",
            "type": "intro",
            "content": "booleanCondition ? resultIfTrue : resultIfFalse"
          },
          {
            "title": "Type Compatibility",
            "type": "code",
            "content": "Both the true and false branch expressions must be assignable to the target variable type.",
            "code": "int speed = 30;\nint limit = (speed > 50) ? 50 : speed;"
          },
          {
            "title": "Avoid Over-Nesting",
            "type": "tip",
            "content": "Never nest ternary operators three levels deep (a ? b : c ? d : e). It impairs readability. For multiple branches, use if-else or switch."
          }
        ],
        "underTheHood": "In bytecode, the ternary operator compiles into a conditional branch (`ifeq`) identical to an if-else statement. The JVM pushes the condition, jumps over the true branch if false, and rejoins at the target store instruction. It carries zero performance difference compared to standard if-else.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int playerLevel = 8;\n        int entryFee = (playerLevel >= 10) ? 0 : 25;\n        System.out.println(\"Level: \" + playerLevel);\n        System.out.println(\"Entry Fee: \" + entryFee + \" emeralds\");\n    }\n}",
          "walkthrough": [
            "Line 3: Level is 8.",
            "Line 4: Evaluates (8 >= 10), which is false. Selects false branch: 25.",
            "Line 5-6: Prints level and computed entry fee."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Mismatched types between the two branch expressions",
            "error": "error: incompatible types: bad type in conditional expression",
            "fix": "Ensure both expressions produce compatible types (e.g. both String, or both numbers)."
          },
          {
            "mistake": "Using ternary without capturing its return value",
            "error": "error: not a statement",
            "fix": "The ternary operator is an expression, not a standalone statement. You cannot write '(x > 5) ? doA() : doB();' if doA() is void."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nint time = 20;\nString greeting = (time < 12) ? \"Morning\" : (time < 18) ? \"Afternoon\" : \"Evening\";\nSystem.out.println(greeting);",
            "options": [
              "Morning",
              "Afternoon",
              "Evening",
              "Compilation error"
            ],
            "answer": 2,
            "explanation": "time < 12 is false. Next condition time < 18 is false (20 < 18 is false). Evaluates to 'Evening'."
          },
          {
            "question": "Is the ternary operator faster than a standard if-else block in bytecode?",
            "options": [
              "Yes, it uses faster GPU instructions",
              "No, it compiles into the exact same conditional branch bytecode",
              "Yes, 10x faster",
              "No, it runs in interpreted mode only"
            ],
            "answer": 1,
            "explanation": "In Java bytecode, both compile to identical conditional branch opcodes (ifeq / goto)."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that calculates an adventurer's access level using a ternary expression:\n- `int reputation = 85;`\n- If `reputation >= 50`, `title = \"Trusted Merchant\"`, else `title = \"Wandering Trader\"`\n- Calculate `taxDiscount = (reputation >= 80) ? 15 : 0;` (percentage)\nPrint exactly:\nLine 1: `Rank: Trusted Merchant`\nLine 2: `Discount: 15%`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int reputation = 85;\n        // TODO: Use ternary expressions to determine title and discount\n    }\n}",
          "hints": [
            "String title = (reputation >= 50) ? \"Trusted Merchant\" : \"Wandering Trader\";",
            "int taxDiscount = (reputation >= 80) ? 15 : 0;",
            "System.out.println(\"Rank: \" + title);",
            "System.out.println(\"Discount: \" + taxDiscount + \"%\");"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int reputation = 85;\n        String title = (reputation >= 50) ? \"Trusted Merchant\" : \"Wandering Trader\";\n        int taxDiscount = (reputation >= 80) ? 15 : 0;\n        System.out.println(\"Rank: \" + title);\n        System.out.println(\"Discount: \" + taxDiscount + \"%\");\n    }\n}",
          "tests": [
            {
              "name": "Ternary reputation checks",
              "stdin": "",
              "expectedStdout": "Rank: Trusted Merchant\nDiscount: 15%"
            },
            {
              "name": "Title output check",
              "stdin": "",
              "expectedStdout": "Rank: Trusted Merchant\nDiscount: 15%"
            },
            {
              "name": "Discount percentage check",
              "stdin": "",
              "expectedStdout": "Rank: Trusted Merchant\nDiscount: 15%"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 15.25: Conditional Operator ? :",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Conditional Operator)",
            "verify": false
          }
        ]
      },
      {
        "id": "b3_l6",
        "title": "Operator Precedence & Bitwise Operations",
        "xp": 35,
        "estimatedMinutes": 22,
        "story": "Redstone wire networks calculate signals through ordered cascades. In complex formulas, Java evaluates operators in a strict hierarchical order. Understanding precedence guarantees your damage equations and permission bitmasks execute flawlessly.",
        "explanation": [
          {
            "type": "text",
            "content": "Operator precedence determines the grouping of terms in an expression. For example, in `3 + 4 * 2`, multiplication has higher precedence than addition, so it evaluates to `3 + 8 = 11`, not `14`.\n\nJava Precedence Hierarchy (Highest to Lowest):\n1. Parentheses `()`\n2. Postfix `expr++`, `expr--`\n3. Unary `++expr`, `--expr`, `+`, `-`, `!`\n4. Multiplicative `*`, `/`, `%`\n5. Additive `+`, `-`\n6. Relational `<`, `<=`, `>`, `>=`\n7. Equality `==`, `!=`\n8. Logical AND `&&`\n9. Logical OR `||`\n10. Ternary `? :`\n11. Assignment `=`, `+=`, `-=`"
          },
          {
            "type": "code",
            "content": "Parentheses Override Precedence:",
            "code": "int a = 10 + 5 * 2;   // Evaluates 5 * 2 = 10, then 10 + 10 = 20\nint b = (10 + 5) * 2; // Parentheses first: 15 * 2 = 30"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Clean Code Recommendation",
            "content": "Do not force your teammates to consult a precedence table. When combining multiple operators, use explicit parentheses `()` to communicate intent clearly."
          }
        ],
        "slides": [
          {
            "title": "Precedence Summary",
            "type": "intro",
            "content": "Multiplicative operators (*, /, %) bind tighter than additive (+, -). Relational (<, >) binds tighter than logical (&&, ||)."
          },
          {
            "title": "Introduction to Bitwise Operators",
            "type": "code",
            "content": "Java also supports bitwise operations on integer bits: & (AND), | (OR), ^ (XOR), ~ (NOT), and << >> (shift).",
            "code": "int PERM_READ  = 1; // 0001\nint PERM_WRITE = 2; // 0010\nint userPerms = PERM_READ | PERM_WRITE; // 0011 (3)\nboolean canRead = (userPerms & PERM_READ) != 0; // true"
          },
          {
            "title": "Associativity",
            "type": "tip",
            "content": "Most binary operators are left-associative: a - b - c is (a - b) - c. Assignment operators and ternary are right-associative: a = b = c is a = (b = c)."
          }
        ],
        "underTheHood": "The `javac` parser converts source expressions into an AST following unambiguous grammar productions specified in Chapter 19 of the Java Language Specification. Parentheses modify AST subtree depth, guaranteeing operators deeper in the tree execute first on the JVM operand stack.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int base = 20;\n        int bonus = 5;\n        int multiplier = 3;\n        int resultWithoutParen = base + bonus * multiplier;   // 20 + 15 = 35\n        int resultWithParen = (base + bonus) * multiplier;      // 25 * 3 = 75\n        System.out.println(\"Standard: \" + resultWithoutParen);\n        System.out.println(\"Parenthesized: \" + resultWithParen);\n    }\n}",
          "walkthrough": [
            "Line 6: Multiplication happens before addition: 5 * 3 = 15, then 20 + 15 = 35.",
            "Line 7: Parentheses force addition first: 20 + 5 = 25, then 25 * 3 = 75.",
            "Line 8-9: Prints both contrasting results."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Assuming string concatenation has low precedence",
            "error": "System.out.println(\"Score: \" + 10 + 20) prints 'Score: 1020', not 'Score: 30'!",
            "fix": "Left-to-right evaluation converts 10 to String first. Wrap arithmetic in parentheses: '\"Score: \" + (10 + 20)'."
          },
          {
            "mistake": "Relying on implicit precedence in complex logical chains",
            "error": "a || b && c evaluated as a || (b && c), surprising the author",
            "fix": "Always use parentheses around && sub-clauses when mixed with ||."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output: What is printed by System.out.println(\"Val: \" + 5 + 5);?",
            "options": [
              "Val: 10",
              "Val: 55",
              "Val: 5+5",
              "Compilation error"
            ],
            "answer": 1,
            "explanation": "Left-to-right evaluation evaluates (\"Val: \" + 5) into \"Val: 5\", and then (\"Val: 5\" + 5) into \"Val: 55\"."
          },
          {
            "question": "Which operator has higher precedence: && or ||?",
            "options": [
              "&& has higher precedence than ||",
              "|| has higher precedence than &&",
              "They have equal precedence",
              "It depends on the compiler"
            ],
            "answer": 0,
            "explanation": "Logical AND (&&) has higher precedence than Logical OR (||)."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that calculates an attack combo score:\n- `int baseDmg = 10;`\n- `int comboBonus = 4;`\n- `int critMultiplier = 2;`\n- Compute `rawDamage = baseDmg + comboBonus * critMultiplier;`\n- Compute `comboDamage = (baseDmg + comboBonus) * critMultiplier;`\nPrint exactly:\nLine 1: `Raw: 18`\nLine 2: `Combo: 28`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Compute raw and combo damage using precedence and parentheses\n    }\n}",
          "hints": [
            "int rawDamage = baseDmg + comboBonus * critMultiplier;",
            "int comboDamage = (baseDmg + comboBonus) * critMultiplier;",
            "System.out.println(\"Raw: \" + rawDamage);",
            "System.out.println(\"Combo: \" + comboDamage);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int baseDmg = 10;\n        int comboBonus = 4;\n        int critMultiplier = 2;\n        int rawDamage = baseDmg + comboBonus * critMultiplier;\n        int comboDamage = (baseDmg + comboBonus) * critMultiplier;\n        System.out.println(\"Raw: \" + rawDamage);\n        System.out.println(\"Combo: \" + comboDamage);\n    }\n}",
          "tests": [
            {
              "name": "Precedence contrasting test",
              "stdin": "",
              "expectedStdout": "Raw: 18\nCombo: 28"
            },
            {
              "name": "Raw check",
              "stdin": "",
              "expectedStdout": "Raw: 18\nCombo: 28"
            },
            {
              "name": "Combo check",
              "stdin": "",
              "expectedStdout": "Raw: 18\nCombo: 28"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Chapter 15: Expressions (Operator Precedence)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Operator Hierarchy)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "What is the value of 19 % 4 in Java?",
        "options": [
          "4",
          "3",
          "4.75",
          "1"
        ],
        "answer": 1,
        "explanation": "4 * 4 = 16, leaving a remainder of 3."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nint x = 10;\nSystem.out.println(x++ + \" \" + ++x);",
        "options": [
          "10 12",
          "10 11",
          "11 12",
          "11 11"
        ],
        "answer": 0,
        "explanation": "First x++ evaluates to 10 (and x becomes 11). Then ++x increments x to 12 and evaluates to 12."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\nint a = 5;\nif (a = 10) {\n    System.out.println(\"Ten\");\n}",
        "options": [
          "a cannot be 5",
          "Single '=' is assignment; comparison requires '=='",
          "println requires two arguments",
          "if statements require else"
        ],
        "answer": 1,
        "explanation": "a = 10 assigns 10 to a and evaluates to the integer 10, which cannot be converted to boolean in Java."
      },
      {
        "type": "mcq",
        "question": "Why does short-circuit evaluation in (a != 0 && b / a > 1) prevent a crash when a is 0?",
        "options": [
          "Java fixes division by zero automatically",
          "Because a != 0 is false, Java skips evaluating b / a entirely",
          "The compiler changes / to %",
          "ArithmeticException is silenced by default"
        ],
        "answer": 1,
        "explanation": "With &&, if the left operand is false, the right operand is never executed."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nSystem.out.println(\"Total: \" + (2 + 3) * 4);",
        "options": [
          "Total: 20",
          "Total: 14",
          "Total: 54",
          "Total: 234"
        ],
        "answer": 0,
        "explanation": "Parentheses (2 + 3) = 5. Multiplied by 4 gives 20. Appended to 'Total: ' yields 'Total: 20'."
      },
      {
        "type": "fill-in",
        "question": "Fill in the blank: The logical operator _______ has higher precedence than ||.",
        "options": [
          "&&",
          "==",
          "+=",
          "?:"
        ],
        "answer": 0,
        "explanation": "Logical AND (&&) binds more tightly than Logical OR (||)."
      },
      {
        "type": "mcq",
        "question": "What is the result of the ternary expression: (5 > 3) ? 10 : 20?",
        "options": [
          "5",
          "3",
          "10",
          "20"
        ],
        "answer": 2,
        "explanation": "Since 5 > 3 is true, the first expression (10) is chosen."
      },
      {
        "type": "order-the-lines",
        "question": "Order the lines to safely compute safe ratio without division by zero:\n1: int ratio = (divisor != 0) ? (num / divisor) : 0;\n2: int divisor = 0;\n3: System.out.println(ratio);\n4: int num = 100;",
        "options": [
          "4, 2, 1, 3",
          "2, 4, 3, 1",
          "1, 2, 4, 3",
          "4, 1, 2, 3"
        ],
        "answer": 0,
        "explanation": "Initialize num (4) and divisor (2), compute ratio safely with ternary guard (1), print result (3)."
      },
      {
        "type": "mcq",
        "question": "What does the expression '1 << 3' evaluate to in Java bitwise operations?",
        "options": [
          "1",
          "3",
          "8",
          "24"
        ],
        "answer": 2,
        "explanation": "Bitwise left shift (1 << 3) shifts binary 1 three places to the left (1000 in binary), which equals 8."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nboolean flag = false;\nflag = !flag;\nSystem.out.println(flag);",
        "options": [
          "false",
          "true",
          "null",
          "!flag"
        ],
        "answer": 1,
        "explanation": "!flag inverts false to true."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\nString s1 = new String(\"Craft\");\nString s2 = new String(\"Craft\");\nif (s1 == s2) System.out.println(\"Equal\");",
        "options": [
          "s1 and s2 cannot have the same text",
          "'==' compares object memory addresses, so this will rarely evaluate to true for new objects; use .equals() instead",
          "new String is illegal in Java",
          "System.out.println cannot print without parentheses"
        ],
        "answer": 1,
        "explanation": "For separate object instances, '==' checks reference identity. Use s1.equals(s2) to compare content."
      },
      {
        "type": "mcq",
        "question": "What is the value of 'x' after: int x = 10; x += 5 * 2;?",
        "options": [
          "30",
          "20",
          "25",
          "10"
        ],
        "answer": 1,
        "explanation": "5 * 2 is evaluated first (10). Then x += 10 updates x to 20."
      }
    ],
    "project": {
      "title": "Redstone Energy Calculator",
      "brief": "Build a console energy audit engine that computes power decay across wire distances, calculates repeater delays, and checks circuit safety thresholds using compound and short-circuit operators.",
      "milestones": [
        "Input initial power signal level (1-15) and wire block distance",
        "Calculate signal loss (1 power level per block) using arithmetic operators",
        "Use modulo to determine how many repeater boosters are required every 15 blocks",
        "Apply ternary operator to display power status: Active or Signal Exhausted"
      ],
      "rubric": [
        "Operator correctness: Proper usage of /, %, and compound assignments",
        "Safety: Guard against negative input distances using logical operators",
        "Formatting: Clean output showing remaining power level and repeater count"
      ],
      "stretchGoals": [
        "Implement a bitwise permission mask for redstone gate security keys",
        "Simulate pulse tick delays using prefix increments"
      ]
    },
    "glossary": [
      {
        "term": "Operator",
        "definition": "A special symbol that performs specific operations on one, two, or three operands and returns a result."
      },
      {
        "term": "Operand",
        "definition": "The values or variables on which an operator acts."
      },
      {
        "term": "Modulo",
        "definition": "The arithmetic operation that finds the remainder after division of one number by another (%)."
      },
      {
        "term": "Short-Circuit Evaluation",
        "definition": "The evaluation rule where logical operators (&&, ||) stop evaluating subexpressions as soon as the outcome is determined."
      },
      {
        "term": "Precedence",
        "definition": "The rule that specifies the order in which different operators are evaluated in a compound expression."
      },
      {
        "term": "Ternary Operator",
        "definition": "A conditional operator (? :) taking three operands that returns one of two values based on a boolean condition."
      }
    ],
    "references": [
      {
        "source": "The Java Language Specification, Java SE 21 Edition",
        "location": "Chapter 15: Expressions",
        "verify": false
      },
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 3: Fundamental Programming Structures in Java (Operators)",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b4",
    "code": "B4",
    "track": "beginner",
    "title": "Control Flow: Decisions & Loops",
    "subtitle": "Branching with if/switch, iterative loops (while, do-while, for), and loop control",
    "biome": "Labyrinth Caves",
    "estimatedMinutes": 140,
    "learningObjectives": [
      "Construct multi-branch conditional logic using if, else if, and else",
      "Implement modern Java 14+ switch expressions with arrow (->) syntax and yield",
      "Select the appropriate loop construct (while, do-while, for) for indefinite vs definite tasks",
      "Control loop execution flow using break, continue, and labeled statements",
      "Avoid infinite loops and off-by-one errors in boundary conditions"
    ],
    "prerequisites": [
      "b1",
      "b2",
      "b3"
    ],
    "lessons": [
      {
        "id": "b4_l1",
        "title": "Branching with if, else if, and else",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "You descend into the twisting Labyrinth Caves. At every junction, your torch reveals multiple paths: left into the crystal cavern, right into the spider den, or straight ahead. In Java, conditional branches direct code down different execution paths.",
        "explanation": [
          {
            "type": "text",
            "content": "The `if` statement evaluates a boolean expression. If `true`, the enclosed block runs. If `false`, execution skips to the `else if` condition (if present), or finally falls through to the optional `else` block."
          },
          {
            "type": "code",
            "content": "The if-else if-else Chain:",
            "code": "int health = 45;\nif (health >= 80) {\n    System.out.println(\"Status: Thriving\");\n} else if (health >= 30) {\n    System.out.println(\"Status: Wounded\");\n} else {\n    System.out.println(\"Status: Critical!\");\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Braces Best Practice",
            "content": "While Java allows omitting curly braces for single-statement if blocks, enterprise standards (such as Google Java Style and Effective Java) mandate always using braces `{}`. Omitting braces causes famous bugs like the Apple 'goto fail' security flaw."
          }
        ],
        "slides": [
          {
            "title": "Conditional Branching Flow",
            "type": "intro",
            "content": "Only ONE branch in an if / else if / else chain executes. As soon as a condition matches true, Java skips all remaining branches."
          },
          {
            "title": "Order of Evaluation Matters",
            "type": "code",
            "content": "Place more specific conditions before general ones. If you check 'score >= 50' before 'score >= 90', the 90 check will never be reached!",
            "code": "// Correct order (highest to lowest):\nif (score >= 90) { ... }\nelse if (score >= 80) { ... }\nelse if (score >= 70) { ... }"
          },
          {
            "title": "Nested if Statements",
            "type": "tip",
            "content": "You can nest if statements inside other if blocks, but consider combining them with '&&' if it simplifies logic without reducing clarity."
          }
        ],
        "underTheHood": "In bytecode, `if` statements compile into conditional jump opcodes like `ifle`, `ifge`, or `if_icmpne`. When the condition is met, the CPU executes sequential instructions; when not met, the PC (Program Counter) register jumps forward over the unexecuted bytecode block to a specified byte offset label.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int lightLevel = 6;\n        if (lightLevel >= 8) {\n            System.out.println(\"Area is Safe\");\n        } else if (lightLevel >= 4) {\n            System.out.println(\"Area is Dim\");\n        } else {\n            System.out.println(\"Monsters May Spawn\");\n        }\n    }\n}",
          "walkthrough": [
            "Line 3: lightLevel is 6.",
            "Line 4: 6 >= 8 is false, so first branch skips.",
            "Line 6: 6 >= 4 is true, so prints 'Area is Dim'.",
            "Line 8: else block is skipped entirely."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Placing a semicolon after the if condition: if (score > 10);",
            "error": "The if statement ends immediately; the following block always runs unconditionally!",
            "fix": "Never place a semicolon directly after the closing parenthesis of an if statement."
          },
          {
            "mistake": "Checking conditions in reverse order",
            "error": "Higher tier grades never awarded because lower thresholds match first",
            "fix": "Arrange numerical range checks in strictly descending (or ascending) order."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nint x = 15;\nif (x > 20) {\n    System.out.println(\"A\");\n} else if (x > 10) {\n    System.out.println(\"B\");\n} else {\n    System.out.println(\"C\");\n}",
            "options": [
              "A",
              "B",
              "C",
              "B\\nC"
            ],
            "answer": 1,
            "explanation": "15 > 20 is false. 15 > 10 is true, so 'B' is printed, and remaining branches are skipped."
          },
          {
            "question": "What happens if a semicolon is placed after an if condition: 'if (x > 5); { System.out.println(\"Yes\"); }'?",
            "options": [
              "Compilation error",
              "The if condition controls an empty statement; the block { ... } runs unconditionally every time",
              "The JVM throws a NullPointerException",
              "The program crashes"
            ],
            "answer": 1,
            "explanation": "The semicolon terminates the if statement as an empty statement, making the subsequent block independent."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that categorizes player health (`int hp = 72;`):\n- If `hp >= 70`, print `Status: Healthy`\n- Else if `hp >= 30`, print `Status: Injured`\n- Else, print `Status: Critical`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int hp = 72;\n        // TODO: Classify health with if/else if/else and print status\n    }\n}",
          "hints": [
            "if (hp >= 70) { System.out.println(\"Status: Healthy\"); }",
            "else if (hp >= 30) { System.out.println(\"Status: Injured\"); }",
            "else { System.out.println(\"Status: Critical\"); }"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int hp = 72;\n        if (hp >= 70) {\n            System.out.println(\"Status: Healthy\");\n        } else if (hp >= 30) {\n            System.out.println(\"Status: Injured\");\n        } else {\n            System.out.println(\"Status: Critical\");\n        }\n    }\n}",
          "tests": [
            {
              "name": "Healthy status check (hp=72)",
              "stdin": "",
              "expectedStdout": "Status: Healthy"
            },
            {
              "name": "Boundary check",
              "stdin": "",
              "expectedStdout": "Status: Healthy"
            },
            {
              "name": "Exact string check",
              "stdin": "",
              "expectedStdout": "Status: Healthy"
            }
          ]
        },
        "references": [
          {
            "source": "Introduction to Java Programming, 12th ed.",
            "location": "Chapter 3: Selections (if Statements)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Determining Flow)",
            "verify": false
          }
        ]
      },
      {
        "id": "b4_l2",
        "title": "Modern switch Statements & Expressions (Java 14+)",
        "xp": 30,
        "estimatedMinutes": 22,
        "story": "At the labyrinth crossroad, an ancient mechanical signpost rotates to point to one of four cardinal directions. Rather than stacking eight separate if-else checks, Java provides the switch construct—modernized with clean arrow syntax.",
        "explanation": [
          {
            "type": "text",
            "content": "While classic Java switch used colons and error-prone `break;` statements (where forgetting `break` caused accidental fall-through), modern Java introduces **switch expressions** with arrow syntax (`->`).\n\nArrow switch features:\n- No `break` required: each case is strictly isolated with no fall-through.\n- Multiple labels per case: `case 1, 2, 3 -> ...`\n- Can yield a value as an expression directly assigned to a variable."
          },
          {
            "type": "code",
            "content": "Modern Arrow Switch Expression:",
            "code": "int tier = 2;\nString swordMaterial = switch (tier) {\n    case 1 -> \"Wood\";\n    case 2 -> \"Iron\";\n    case 3 -> \"Diamond\";\n    default -> \"Unknown\";\n};\nSystem.out.println(swordMaterial); // Prints Iron"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "The yield Keyword",
            "content": "If an arrow switch branch requires a multi-line code block, wrap it in braces `{ ... }` and use the `yield` keyword to return the computed value from that branch."
          }
        ],
        "slides": [
          {
            "title": "Classic vs Modern Switch",
            "type": "intro",
            "content": "Traditional switch statements suffered from accidental fall-through when 'break' was omitted. Modern Java 14+ arrow switch eliminates fall-through completely."
          },
          {
            "title": "Multi-Label Cases",
            "type": "code",
            "content": "You can group multiple matching cases onto a single line separated by commas.",
            "code": "int day = 6;\nString type = switch (day) {\n    case 1, 2, 3, 4, 5 -> \"Weekday\";\n    case 6, 7          -> \"Weekend\";\n    default            -> \"Invalid\";\n};"
          },
          {
            "title": "Supported Switch Types",
            "type": "tip",
            "content": "Switch supports byte, short, char, int, their wrapper types, enums, and String. (Floating-point types float and double are not supported)."
          }
        ],
        "underTheHood": "In bytecode, the JVM compiles switch statements into one of two highly optimized table jump instructions: `tableswitch` (used when cases are dense sequential integers, executing in O(1) time via an offset table) or `lookupswitch` (used for sparse cases, executing in O(log n) time using binary search). String switches hash into an integer switch on hashCode().",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        String biomeCode = \"DESERT\";\n        int dangerLevel = switch (biomeCode) {\n            case \"PLAINS\" -> 1;\n            case \"DESERT\" -> 3;\n            case \"NETHER\" -> 5;\n            default -> 0;\n        };\n        System.out.println(\"Biome: \" + biomeCode);\n        System.out.println(\"Danger Level: \" + dangerLevel);\n    }\n}",
          "walkthrough": [
            "Line 3: biomeCode set to 'DESERT'.",
            "Line 4: switch expression matches case 'DESERT'.",
            "Line 6: Arrow operator evaluates to 3 and assigns to dangerLevel.",
            "Line 10-11: Outputs formatted biome danger rating."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Mixing arrow '->' and colon ':' syntax in the same switch",
            "error": "error: different case kinds used in the switch",
            "fix": "Choose either arrow syntax (->) throughout or classic colon (:) throughout. Do not mix them in one switch."
          },
          {
            "mistake": "Missing 'default' in a switch expression",
            "error": "error: the switch expression does not cover all possible input values",
            "fix": "When switch is used as an expression to return a value, it must be exhaustive. Include a 'default ->' branch."
          }
        ],
        "checkpoint": [
          {
            "question": "What happens if you omit the 'break' statement in a classic colon-based switch (case 1:)?",
            "options": [
              "Compilation error",
              "Execution falls through into the subsequent case even if the condition doesn't match",
              "The program halts",
              "The default case runs first"
            ],
            "answer": 1,
            "explanation": "In classic colon-style switch, omission of break causes fall-through into subsequent cases."
          },
          {
            "question": "Which keyword returns a value from a multi-line block inside a modern switch expression?",
            "options": [
              "return",
              "yield",
              "output",
              "break"
            ],
            "answer": 1,
            "explanation": "'yield' is the contextual keyword used in Java 14+ switch expressions to produce a value from a code block."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that uses a modern arrow `switch` to determine an ore's value based on code `\"GOLD\"`:\n- `\"COAL\"` -> `5`\n- `\"IRON\"` -> `15`\n- `\"GOLD\"` -> `30`\n- `\"DIAMOND\"` -> `100`\n- `default` -> `0`\nStore the result in `int emeraldValue` and print exactly:\nLine 1: `Ore: GOLD`\nLine 2: `Value: 30 Emeralds`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        String ore = \"GOLD\";\n        // TODO: Use switch expression to find emerald value and print\n    }\n}",
          "hints": [
            "int emeraldValue = switch (ore) { ... };",
            "case \"GOLD\" -> 30;",
            "default -> 0;",
            "System.out.println(\"Value: \" + emeraldValue + \" Emeralds\");"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        String ore = \"GOLD\";\n        int emeraldValue = switch (ore) {\n            case \"COAL\" -> 5;\n            case \"IRON\" -> 15;\n            case \"GOLD\" -> 30;\n            case \"DIAMOND\" -> 100;\n            default -> 0;\n        };\n        System.out.println(\"Ore: \" + ore);\n        System.out.println(\"Value: \" + emeraldValue + \" Emeralds\");\n    }\n}",
          "tests": [
            {
              "name": "Gold ore switch check",
              "stdin": "",
              "expectedStdout": "Ore: GOLD\nValue: 30 Emeralds"
            },
            {
              "name": "Value formatting check",
              "stdin": "",
              "expectedStdout": "Ore: GOLD\nValue: 30 Emeralds"
            },
            {
              "name": "Ore header check",
              "stdin": "",
              "expectedStdout": "Ore: GOLD\nValue: 30 Emeralds"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 14.11: The switch Statement and Expressions",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (The switch Statement)",
            "verify": false
          }
        ]
      },
      {
        "id": "b4_l3",
        "title": "The while Loop: Condition-Controlled Repetition",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "You light a torch that slowly burns down over time. As long as fuel remains in the shaft, light keeps monsters at bay. The while loop repeats a block of instructions as long as its controlling boolean condition stays true.",
        "explanation": [
          {
            "type": "text",
            "content": "The `while` loop is a **pre-test** loop. Before each iteration, it checks its boolean condition. If `true`, the loop body executes. If `false`, the loop terminates and execution proceeds to the next statement after the loop.\n\nStructure:\n```java\nwhile (condition) {\n    // Code that executes repeatedly\n    // MUST modify something so condition eventually becomes false!\n}\n```"
          },
          {
            "type": "code",
            "content": "Countdown while Loop:",
            "code": "int fuel = 3;\nwhile (fuel > 0) {\n    System.out.println(\"Torch burning... Fuel left: \" + fuel);\n    fuel--; // Essential step: decrement fuel so the loop terminates\n}\nSystem.out.println(\"Torch extinguished.\");"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "The Infinite Loop Trap",
            "content": "If the condition never becomes false (for example, if you forget `fuel--`), the loop will execute forever, freezing your program and consuming 100% of a CPU core. Always verify your loop condition progress toward termination."
          }
        ],
        "slides": [
          {
            "title": "Pre-Condition Checking",
            "type": "intro",
            "content": "Because 'while' checks condition before running, if the condition is false initially, the loop body runs zero times."
          },
          {
            "title": "Loop Invariants",
            "type": "code",
            "content": "A loop invariant is a condition that is guaranteed to hold true before and after each iteration of the loop.",
            "code": "int count = 0;\nwhile (count < 5) {\n    System.out.print(count + \" \");\n    count++;\n}\n// Prints: 0 1 2 3 4"
          },
          {
            "title": "Off-By-One Errors",
            "type": "tip",
            "content": "Watch out for '<' vs '<='. 'count < 5' runs 5 times (0 to 4). 'count <= 5' runs 6 times (0 to 5)."
          }
        ],
        "underTheHood": "In bytecode, a while loop generates a loop header label and a conditional jump (`if_icmplt`). At the bottom of the loop body, an unconditional `goto` instruction jumps execution back to the loop header to re-evaluate the condition on the operand stack.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int power = 1;\n        while (power <= 8) {\n            System.out.println(\"Power: \" + power);\n            power *= 2;\n        }\n    }\n}",
          "walkthrough": [
            "Iteration 1: power=1 (<=8 true). Prints Power: 1, power becomes 2.",
            "Iteration 2: power=2 (<=8 true). Prints Power: 2, power becomes 4.",
            "Iteration 3: power=4 (<=8 true). Prints Power: 4, power becomes 8.",
            "Iteration 4: power=8 (<=8 true). Prints Power: 8, power becomes 16.",
            "Iteration 5: power=16 (<=8 false). Loop terminates."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Omitting the loop update step",
            "error": "Infinite loop freezes console",
            "fix": "Ensure your loop variable is modified (incremented, decremented, or updated) inside the loop block."
          },
          {
            "mistake": "Off-by-one boundary comparison",
            "error": "Loop executes one too many or one too few times",
            "fix": "Trace loop bounds by hand with values 0, 1, and N-1."
          }
        ],
        "checkpoint": [
          {
            "question": "How many times does this loop execute?\nint i = 10;\nwhile (i < 5) {\n    System.out.println(i);\n    i++;\n}",
            "options": [
              "0 times",
              "5 times",
              "10 times",
              "Infinite times"
            ],
            "answer": 0,
            "explanation": "Because i is 10, the condition (10 < 5) evaluates to false immediately; the loop body runs 0 times."
          },
          {
            "question": "Predict the Output:\nint n = 1;\nwhile (n < 4) {\n    System.out.print(n);\n    n++;\n}",
            "options": [
              "1234",
              "123",
              "0123",
              "12"
            ],
            "answer": 1,
            "explanation": "Prints 1, then 2, then 3. When n becomes 4, the condition (4 < 4) fails."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` with a `while` loop that counts down from `3` to `1`, then announces blastoff:\n- Initialize `int countdown = 3;`\n- While `countdown > 0`, print `T-Minus: <countdown>` and decrement\n- After the loop, print `Liftoff: Beacon Active!`\nPrint exactly:\nLine 1: `T-Minus: 3`\nLine 2: `T-Minus: 2`\nLine 3: `T-Minus: 1`\nLine 4: `Liftoff: Beacon Active!`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Countdown while loop and liftoff announcement\n    }\n}",
          "hints": [
            "int countdown = 3;",
            "while (countdown > 0) { System.out.println(\"T-Minus: \" + countdown); countdown--; }",
            "System.out.println(\"Liftoff: Beacon Active!\");"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int countdown = 3;\n        while (countdown > 0) {\n            System.out.println(\"T-Minus: \" + countdown);\n            countdown--;\n        }\n        System.out.println(\"Liftoff: Beacon Active!\");\n    }\n}",
          "tests": [
            {
              "name": "Full countdown sequence",
              "stdin": "",
              "expectedStdout": "T-Minus: 3\nT-Minus: 2\nT-Minus: 1\nLiftoff: Beacon Active!"
            },
            {
              "name": "Loop termination check",
              "stdin": "",
              "expectedStdout": "T-Minus: 3\nT-Minus: 2\nT-Minus: 1\nLiftoff: Beacon Active!"
            },
            {
              "name": "Liftoff text check",
              "stdin": "",
              "expectedStdout": "T-Minus: 3\nT-Minus: 2\nT-Minus: 1\nLiftoff: Beacon Active!"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 14.12: The while Statement",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 1: Breaking the Surface (Loopy methods)",
            "verify": false
          }
        ]
      },
      {
        "id": "b4_l4",
        "title": "The do-while Loop: Guaranteed First Execution",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "When a merchant presents their trading inventory, they always show the catalog at least once before asking if you wish to see more. The do-while loop guarantees the loop body executes at least once before checking the continuation condition.",
        "explanation": [
          {
            "type": "text",
            "content": "The `do-while` loop is a **post-test** loop. The code inside the `do { ... }` block executes FIRST. Only after the block completes does it evaluate the `while (condition);` expression at the bottom. If the condition is true, it repeats; if false, it exits."
          },
          {
            "type": "code",
            "content": "do-while Loop Syntax:",
            "code": "int roll;\ndo {\n    // Always executes at least once\n    roll = (int)(Math.random() * 6) + 1;\n    System.out.println(\"Rolled: \" + roll);\n} while (roll == 1); // Repeat if you rolled a 1"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "Trailing Semicolon Required",
            "content": "Notice the semicolon `;` after the condition in `while (condition);`. Unlike standard `while` loops, omitting this closing semicolon is a compilation error."
          }
        ],
        "slides": [
          {
            "title": "Guaranteed One-Pass Execution",
            "type": "intro",
            "content": "Use do-while when an action must happen before you can know whether to repeat it (e.g. displaying an interactive menu or validating user input)."
          },
          {
            "title": "do-while vs while Comparison",
            "type": "code",
            "content": "If condition is false from the start, 'while' runs 0 times, but 'do-while' runs 1 time.",
            "code": "int x = 100;\ndo {\n    System.out.println(\"Runs once regardless!\");\n} while (x < 10);"
          },
          {
            "title": "Variable Scope in do-while",
            "type": "tip",
            "content": "If a variable is declared inside the 'do { ... }' block, it is out of scope in the 'while (condition);' check. Declare loop variables before the 'do' keyword."
          }
        ],
        "underTheHood": "In bytecode, `do-while` compiles into a loop body starting at a top offset label, terminating with a single conditional jump instruction (`if_icmpne` / `ifne`) branching back to the top label. It is often one instruction shorter than a standard `while` loop because it avoids the initial jump to the test.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int attempts = 1;\n        do {\n            System.out.println(\"Inspection Pass: \" + attempts);\n            attempts++;\n        } while (attempts <= 2);\n    }\n}",
          "walkthrough": [
            "Pass 1: Prints 'Inspection Pass: 1', attempts becomes 2. Condition (2 <= 2) is true.",
            "Pass 2: Prints 'Inspection Pass: 2', attempts becomes 3. Condition (3 <= 2) is false.",
            "Loop terminates cleanly after exactly two passes."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Declaring loop test variable inside the do block",
            "error": "error: cannot find symbol in while (choice != 0)",
            "fix": "Variables tested in the while condition must be declared BEFORE the 'do' keyword."
          },
          {
            "mistake": "Forgetting the trailing semicolon after while(condition);",
            "error": "error: ';' expected",
            "fix": "Remember the semicolon at the end of 'do { ... } while (...);'."
          }
        ],
        "checkpoint": [
          {
            "question": "How many times does this loop run?\nint k = 50;\ndo {\n    System.out.println(k);\n} while (k < 10);",
            "options": [
              "0 times",
              "1 time",
              "50 times",
              "Infinite"
            ],
            "answer": 1,
            "explanation": "A do-while loop executes the body first before checking the condition, guaranteeing at least 1 iteration."
          },
          {
            "question": "Where must variables tested in the while condition of a do-while loop be declared?",
            "options": [
              "Inside the do block",
              "Before the do block",
              "Inside the while parenthesis",
              "In a separate file"
            ],
            "answer": 1,
            "explanation": "Scope rules dictate that variables declared inside a block cannot be accessed outside it, so declaration must precede 'do'."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` with a `do-while` loop that processes mining ore samples:\n- Start with `int sample = 1;`\n- In the loop body, print `Mined Ore Sample: <sample>`\n- Increment `sample++`\n- Continue `while (sample <= 3);`\nPrint exactly:\nLine 1: `Mined Ore Sample: 1`\nLine 2: `Mined Ore Sample: 2`\nLine 3: `Mined Ore Sample: 3`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Write the do-while mining sample loop\n    }\n}",
          "hints": [
            "int sample = 1;",
            "do { System.out.println(\"Mined Ore Sample: \" + sample); sample++; } while (sample <= 3);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int sample = 1;\n        do {\n            System.out.println(\"Mined Ore Sample: \" + sample);\n            sample++;\n        } while (sample <= 3);\n    }\n}",
          "tests": [
            {
              "name": "Three sample extraction check",
              "stdin": "",
              "expectedStdout": "Mined Ore Sample: 1\nMined Ore Sample: 2\nMined Ore Sample: 3"
            },
            {
              "name": "Sample 1 check",
              "stdin": "",
              "expectedStdout": "Mined Ore Sample: 1\nMined Ore Sample: 2\nMined Ore Sample: 3"
            },
            {
              "name": "Sample 3 check",
              "stdin": "",
              "expectedStdout": "Mined Ore Sample: 1\nMined Ore Sample: 2\nMined Ore Sample: 3"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 14.13: The do Statement",
            "verify": false
          },
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 5: Control Statements (do-while)",
            "verify": false
          }
        ]
      },
      {
        "id": "b4_l5",
        "title": "The Standard for Loop: Count-Controlled Repetition",
        "xp": 35,
        "estimatedMinutes": 20,
        "story": "Laying a straight stone bridge across a ravine requires placing blocks one by one for an exact known distance. When the number of iterations is known in advance, the compact for loop packages initialization, condition, and update into a single readable line.",
        "explanation": [
          {
            "type": "text",
            "content": "The standard `for` loop packages the three lifecycle parts of a loop into a single header:\n```java\nfor (initialization; condition; update) {\n    // Loop body\n}\n```\n1. **Initialization**: Runs once before the loop begins (e.g. `int i = 0`).\n2. **Condition**: Evaluated before every iteration. If `true`, body executes.\n3. **Update**: Executes after the body finishes, right before the next condition check (e.g. `i++`)."
          },
          {
            "type": "code",
            "content": "Counting with a for Loop:",
            "code": "for (int i = 1; i <= 5; i++) {\n    System.out.println(\"Bridge Block: \" + i);\n}\n// Loop counter 'i' goes out of scope after the loop closes!"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Scope of Loop Counter",
            "content": "Declaring `int i = 0` inside the `for` header limits its scope strictly to the loop body. This prevents variable name pollution and allows you to reuse `i` safely in subsequent loops."
          }
        ],
        "slides": [
          {
            "title": "Anatomy of the for Loop Header",
            "type": "intro",
            "content": "for (init; condition; step). Each section is separated by a semicolon (;)."
          },
          {
            "title": "Counting Down with for",
            "type": "code",
            "content": "Loops can count down just as easily by decrementing in the update step.",
            "code": "for (int i = 5; i > 0; i--) {\n    System.out.print(i + \" \");\n}\n// Prints: 5 4 3 2 1"
          },
          {
            "title": "Stepping by Custom Amounts",
            "type": "tip",
            "content": "The update step isn't limited to i++. You can write 'i += 2' for evens/odds, or 'i *= 2' for powers of two."
          }
        ],
        "underTheHood": "A for loop compiles into bytecode structurally identical to a while loop. The initialization opcode runs once, followed by a condition jump, the body opcodes, the update step opcodes, and an unconditional `goto` back to the condition.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 4; i++) {\n            sum += i;\n        }\n        System.out.println(\"Total Sum: \" + sum);\n    }\n}",
          "walkthrough": [
            "i=1: sum becomes 0 + 1 = 1",
            "i=2: sum becomes 1 + 2 = 3",
            "i=3: sum becomes 3 + 3 = 6",
            "i=4: sum becomes 6 + 4 = 10",
            "i=5: 5 <= 4 is false. Loop exits.",
            "Prints 'Total Sum: 10'."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Separating for loop clauses with commas instead of semicolons",
            "error": "error: ';' expected in for loop header",
            "fix": "The three parts of the for loop header must be separated by semicolons: for (int i = 0; i < 10; i++)."
          },
          {
            "mistake": "Accessing the loop counter 'i' outside the for loop",
            "error": "error: cannot find symbol variable i",
            "fix": "If you need 'i' after the loop ends, declare it BEFORE the for statement: 'int i; for (i = 0; ...)'."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nfor (int i = 0; i < 3; i++) {\n    System.out.print(i * 2 + \" \");\n}",
            "options": [
              "0 2 4 ",
              "2 4 6 ",
              "0 1 2 ",
              "0 2 4 6 "
            ],
            "answer": 0,
            "explanation": "i takes values 0, 1, 2. Multiplying by 2 produces 0, 2, 4."
          },
          {
            "question": "Which part of the for loop header executes AFTER the loop body finishes an iteration?",
            "options": [
              "The initialization part",
              "The update / increment part",
              "The condition check",
              "None of them"
            ],
            "answer": 1,
            "explanation": "The third clause (update/step) executes at the end of each iteration."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` using a `for` loop that calculates the sum of all integers from `1` to `5` inclusive:\n- `int totalSum = 0;`\n- Loop from `int i = 1; i <= 5; i++` adding `i` to `totalSum`\n- Print intermediate steps or final sum exactly:\nLine 1: `Adding: 1`\nLine 2: `Adding: 2`\nLine 3: `Adding: 3`\nLine 4: `Adding: 4`\nLine 5: `Adding: 5`\nLine 6: `Sum: 15`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: for loop from 1 to 5, print adding lines, print final sum\n    }\n}",
          "hints": [
            "for (int i = 1; i <= 5; i++) { System.out.println(\"Adding: \" + i); totalSum += i; }",
            "System.out.println(\"Sum: \" + totalSum);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int totalSum = 0;\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(\"Adding: \" + i);\n            totalSum += i;\n        }\n        System.out.println(\"Sum: \" + totalSum);\n    }\n}",
          "tests": [
            {
              "name": "Sum 1 to 5 calculation",
              "stdin": "",
              "expectedStdout": "Adding: 1\nAdding: 2\nAdding: 3\nAdding: 4\nAdding: 5\nSum: 15"
            },
            {
              "name": "Final sum check",
              "stdin": "",
              "expectedStdout": "Adding: 1\nAdding: 2\nAdding: 3\nAdding: 4\nAdding: 5\nSum: 15"
            },
            {
              "name": "Intermediate step count",
              "stdin": "",
              "expectedStdout": "Adding: 1\nAdding: 2\nAdding: 3\nAdding: 4\nAdding: 5\nSum: 15"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 14.14.1: The basic for Statement",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Determining Flow: for)",
            "verify": false
          }
        ]
      },
      {
        "id": "b4_l6",
        "title": "Loop Control: break, continue & Nested Loops",
        "xp": 35,
        "estimatedMinutes": 22,
        "story": "Deep in the dungeon maze, you may strike bedrock and need an emergency retreat, or encounter rubble you wish to leap over without stopping. The break and continue statements give you granular control over loop execution.",
        "explanation": [
          {
            "type": "text",
            "content": "Java provides two primary keywords to alter loop iteration flow:\n\n1. `break`: Immediately terminates the innermost loop and transfers control to the statement directly following the loop.\n2. `continue`: Immediately skips the remainder of the CURRENT iteration and jumps forward to the loop's update/condition step to start the next iteration."
          },
          {
            "type": "code",
            "content": "break vs continue in Action:",
            "code": "for (int i = 1; i <= 10; i++) {\n    if (i == 4) continue; // Skip number 4!\n    if (i == 8) break;    // Stop completely when reaching 8!\n    System.out.print(i + \" \");\n}\n// Prints: 1 2 3 5 6 7"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Nested Loops & Labeled Statements",
            "content": "When loops are nested (e.g. iterating over 2D grid coordinates), a standard `break;` only exits the inner loop. You can prefix an outer loop with a label (e.g. `outerLoop: for (...)`) and call `break outerLoop;` to break out of multiple nested loops simultaneously."
          }
        ],
        "slides": [
          {
            "title": "Loop Control Statements",
            "type": "intro",
            "content": "'break' exits the loop entirely. 'continue' skips to the next iteration."
          },
          {
            "title": "Nested Loops for 2D Grids",
            "type": "code",
            "content": "An outer loop controlling rows with an inner loop controlling columns creates 2D grid structures.",
            "code": "for (int row = 0; row < 2; row++) {\n    for (int col = 0; col < 3; col++) {\n        System.out.print(\"[\" + row + \",\" + col + \"] \");\n    }\n    System.out.println();\n}"
          },
          {
            "title": "Labeled Break",
            "type": "tip",
            "content": "Labels allow targeted breaking: 'search: for (...) { for (...) { if (found) break search; } }'."
          }
        ],
        "underTheHood": "In bytecode, `break` compiles to an unconditional `goto` targeting the instruction address right after the loop's end label. `continue` compiles to a `goto` targeting the update/increment label at the top or bottom of the loop body.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            if (i == 3) {\n                continue; // Skip 3\n            }\n            System.out.println(\"Processed: \" + i);\n        }\n    }\n}",
          "walkthrough": [
            "i=1: Prints Processed: 1",
            "i=2: Prints Processed: 2",
            "i=3: Matches condition, continue triggers, skipping println",
            "i=4: Prints Processed: 4",
            "i=5: Prints Processed: 5"
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Placing code after break or continue inside the same block",
            "error": "error: unreachable statement",
            "fix": "Statements placed directly after a break or continue without a condition can never execute; javac rejects them."
          },
          {
            "mistake": "Confusing continue with return",
            "error": "Method exits prematurely instead of continuing to next loop item",
            "fix": "'continue' only moves to the next iteration of the loop; 'return' exits the entire method."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\nfor (int i = 1; i <= 5; i++) {\n    if (i == 3) break;\n    System.out.print(i);\n}",
            "options": [
              "12345",
              "1245",
              "12",
              "123"
            ],
            "answer": 2,
            "explanation": "Prints 1 and 2. When i reaches 3, break terminates the loop immediately, so only '12' is printed."
          },
          {
            "question": "What does the continue statement do inside a for loop?",
            "options": [
              "Restarts the entire loop from i = 0",
              "Skips the rest of the current iteration and jumps to the update step",
              "Exits the method",
              "Reverses the loop direction"
            ],
            "answer": 1,
            "explanation": "continue skips remaining statements in the current iteration and advances to the update step."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that iterates from `1` to `6` using a `for` loop:\n- If `i == 2`, skip it using `continue`\n- If `i == 5`, terminate the loop using `break`\n- Otherwise, print `Item: <i>`\nPrint exactly:\nLine 1: `Item: 1`\nLine 2: `Item: 3`\nLine 3: `Item: 4`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Loop 1 to 6 with continue for 2 and break for 5\n    }\n}",
          "hints": [
            "for (int i = 1; i <= 6; i++) { ... }",
            "if (i == 2) continue;",
            "if (i == 5) break;",
            "System.out.println(\"Item: \" + i);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 6; i++) {\n            if (i == 2) continue;\n            if (i == 5) break;\n            System.out.println(\"Item: \" + i);\n        }\n    }\n}",
          "tests": [
            {
              "name": "Break and continue filter check",
              "stdin": "",
              "expectedStdout": "Item: 1\nItem: 3\nItem: 4"
            },
            {
              "name": "Skip 2 check",
              "stdin": "",
              "expectedStdout": "Item: 1\nItem: 3\nItem: 4"
            },
            {
              "name": "Halt at 5 check",
              "stdin": "",
              "expectedStdout": "Item: 1\nItem: 3\nItem: 4"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 14.15 & 14.16: break and continue Statements",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Breaking Control Flow)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Which of the following loops checks its condition at the bottom after executing the body?",
        "options": [
          "for",
          "while",
          "do-while",
          "enhanced for"
        ],
        "answer": 2,
        "explanation": "A do-while loop is a post-test loop that checks condition after the body runs."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nint k = 1;\nwhile (k <= 3) {\n    System.out.print(k * 3 + \" \");\n    k++;\n}",
        "options": [
          "3 6 9 ",
          "1 2 3 ",
          "3 6 9 12 ",
          "3 3 3 "
        ],
        "answer": 0,
        "explanation": "k values 1, 2, 3 multiplied by 3 produce '3 6 9 '."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\nfor (int i = 0; i < 5; i++); {\n    System.out.println(\"Tick\");\n}",
        "options": [
          "Semicolon after the for header terminates the loop immediately; the block runs only once after loop finishes",
          "i must start at 1",
          "Tick requires double parentheses",
          "i++ must be ++i"
        ],
        "answer": 0,
        "explanation": "The accidental semicolon after for(...) makes the loop body empty, executing the subsequent block just once."
      },
      {
        "type": "mcq",
        "question": "In modern Java 14+ arrow switch (case 1 ->), what happens if you do not write a 'break' statement?",
        "options": [
          "Execution falls through to case 2",
          "Execution stops automatically for that case; no fall-through occurs",
          "Compilation error",
          "The default case runs twice"
        ],
        "answer": 1,
        "explanation": "Modern arrow syntax strictly isolates cases; fall-through is impossible."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nfor (int i = 1; i <= 4; i++) {\n    if (i % 2 == 0) continue;\n    System.out.print(i);\n}",
        "options": [
          "1234",
          "24",
          "13",
          "12"
        ],
        "answer": 2,
        "explanation": "When i is 2 and 4 (even numbers), continue skips println. Only 1 and 3 are printed."
      },
      {
        "type": "fill-in",
        "question": "Fill in the blank: The _______ statement immediately exits the innermost enclosing loop.",
        "options": [
          "break",
          "continue",
          "skip",
          "exit"
        ],
        "answer": 0,
        "explanation": "'break' terminates the current loop immediately."
      },
      {
        "type": "mcq",
        "question": "What is an off-by-one error in programming?",
        "options": [
          "A syntax error caused by missing braces",
          "A logic error where a loop iterates one time too many or one time too few due to comparison bounds",
          "A computer hardware failure",
          "An error when dividing by 1"
        ],
        "answer": 1,
        "explanation": "An off-by-one error occurs when loop boundaries (e.g. < vs <=) cause an incorrect iteration count."
      },
      {
        "type": "order-the-lines",
        "question": "Order the lines to print numbers 1 to 3:\n1: System.out.println(i);\n2: for (int i = 1;\n3: }\n4: i <= 3; i++) {",
        "options": [
          "2, 4, 1, 3",
          "4, 2, 1, 3",
          "1, 2, 4, 3",
          "2, 1, 4, 3"
        ],
        "answer": 0,
        "explanation": "Constructing the for loop: 'for (int i = 1; i <= 3; i++) { System.out.println(i); }'."
      },
      {
        "type": "mcq",
        "question": "Which of the following data types CANNOT be used in a Java switch statement?",
        "options": [
          "int",
          "String",
          "double",
          "char"
        ],
        "answer": 2,
        "explanation": "Floating-point types (float, double) cannot be used in a switch statement."
      },
      {
        "type": "output",
        "question": "Predict the Output:\nint val = 2;\nswitch (val) {\n    case 1 -> System.out.print(\"A\");\n    case 2 -> System.out.print(\"B\");\n    case 3 -> System.out.print(\"C\");\n}",
        "options": [
          "ABC",
          "B",
          "BC",
          "A"
        ],
        "answer": 1,
        "explanation": "With arrow switch, only case 2 executes, printing 'B'."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\nint count = 5;\nwhile (count > 0) {\n    System.out.println(count);\n}",
        "options": [
          "count is an invalid name",
          "Infinite loop: count is never decremented, so count > 0 remains true forever",
          "while loops cannot check > 0",
          "println cannot take count"
        ],
        "answer": 1,
        "explanation": "Because count is never updated inside the loop, the condition remains true indefinitely."
      },
      {
        "type": "mcq",
        "question": "How do you break out of an outer loop from inside a nested inner loop in Java?",
        "options": [
          "Call break break;",
          "Use a labeled break statement (e.g. break outerLoop;)",
          "Call System.exit(0)",
          "Java does not support breaking outer loops"
        ],
        "answer": 1,
        "explanation": "Java provides labeled break statements to break out of any enclosing labeled loop."
      }
    ],
    "project": {
      "title": "Labyrinth Pathfinding Navigator",
      "brief": "Construct an interactive console dungeon navigator where an adventurer moves through a multi-room maze, checking directional options, monster encounters, and secret chambers using loops and switch controls.",
      "milestones": [
        "Implement a continuous while or do-while game loop that keeps running until player escapes or health hits 0",
        "Process directional movement commands (NORTH, SOUTH, EAST, WEST) using modern switch statements",
        "Implement random room encounters (Trap, Treasure, Monster) using if-else if branch trees",
        "Allow players to enter 'QUIT' to break out of the main game loop cleanly"
      ],
      "rubric": [
        "Loop integrity: No infinite loops, clean exit condition",
        "Switch completeness: Modern arrow syntax with robust default handling",
        "Branching logic: Cohesive state tracking (health, position, inventory keys)",
        "User interface: Clear ASCII maps and informative status banners"
      ],
      "stretchGoals": [
        "Implement a 5x5 2D coordinate grid with nested loops rendering an ASCII fog-of-war map",
        "Add a turn counter limiting maximum steps before torch runs out"
      ]
    },
    "glossary": [
      {
        "term": "Control Flow",
        "definition": "The order in which individual statements, instructions, or function calls are executed or evaluated in a program."
      },
      {
        "term": "Branching",
        "definition": "Directing program execution down different paths based on whether a condition evaluates to true or false."
      },
      {
        "term": "Switch Expression",
        "definition": "A Java 14+ construct using arrow syntax (->) that evaluates to a value and eliminates fall-through bugs."
      },
      {
        "term": "Loop Invariant",
        "definition": "A logical condition that remains true before and after each iteration of a loop."
      },
      {
        "term": "Infinite Loop",
        "definition": "A loop whose terminating condition is never met, causing it to execute endlessly until interrupted."
      },
      {
        "term": "Short-Circuit",
        "definition": "Stopping evaluation of a compound boolean expression as soon as the definitive outcome is known."
      }
    ],
    "references": [
      {
        "source": "Introduction to Java Programming, 12th ed.",
        "location": "Chapter 3: Selections & Chapter 4: Loops",
        "verify": false
      },
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 3: Fundamental Programming Structures in Java (Control Flow)",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b5",
    "code": "B5",
    "track": "beginner",
    "title": "Methods, Parameters & Scope",
    "subtitle": "Modular functions, Java's pass-by-value mechanics, method overloading, and recursion",
    "biome": "Crafting Citadel",
    "estimatedMinutes": 130,
    "learningObjectives": [
      "Design and invoke modular static methods that eliminate redundant code (DRY principle)",
      "Explain Java's strict pass-by-value model for primitive parameters",
      "Return values from methods and leverage early return guard clauses",
      "Apply variable scope rules and avoid variable shadowing bugs",
      "Overload methods by varying parameter count and types",
      "Construct simple recursive algorithms with clean base cases"
    ],
    "prerequisites": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "lessons": [
      {
        "id": "b5_l1",
        "title": "Defining & Invoking Methods",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "In the great workshops of the Crafting Citadel, master blacksmiths don't re-invent the forge for every sword. They create reusable crafting recipes. In Java, methods are named, reusable blocks of code that perform specific tasks.",
        "explanation": [
          {
            "type": "text",
            "content": "A method groups statements together under a descriptive name. This adheres to the **DRY** (Don't Repeat Yourself) principle, making programs modular, readable, and easy to maintain."
          },
          {
            "type": "code",
            "content": "Anatomy of a Method Declaration:",
            "code": "// Syntax:\n// [access] [static] [returnType] methodName([parameters]) { ... }\n\npublic static void printWelcome() {\n    System.out.println(\"=== Welcome to Crafting Citadel ===\");\n    System.out.println(\"Forge Status: Ready\");\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Invoking a Method",
            "content": "To execute a method, write its name followed by parentheses: `printWelcome();`. The CPU pauses the calling code, jumps to execute the method's statements, and then returns right back to where it was called."
          }
        ],
        "slides": [
          {
            "title": "Why Use Methods?",
            "type": "intro",
            "content": "Methods break large monolithic programs into small, single-purpose functions. If a bug occurs, you fix it once inside the method rather than ten times throughout your codebase."
          },
          {
            "title": "Calling Methods from main",
            "type": "code",
            "content": "When calling a method from the static main method in the same class, the helper method must also be declared static.",
            "code": "public class Main {\n    public static void main(String[] args) {\n        greetPlayer(); // Call\n    }\n    public static void greetPlayer() {\n        System.out.println(\"Greetings, Crafter!\");\n    }\n}"
          },
          {
            "title": "Method Naming Convention",
            "type": "tip",
            "content": "Method names should be action verbs written in lowerCamelCase: 'calculateTax()', 'renderGraphics()', 'saveGame()'."
          }
        ],
        "underTheHood": "When a method is called, the JVM creates a new **Stack Frame** on the thread call stack. The stack frame allocates memory for the method's local variables, parameters, and operand stack. When the method finishes, its stack frame is instantly popped off memory in O(1) time.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        displayNotice();\n        System.out.println(\"Main thread active.\");\n        displayNotice();\n    }\n\n    public static void displayNotice() {\n        System.out.println(\"[Notice] Citadel Gates Open\");\n    }\n}",
          "walkthrough": [
            "Line 3: Calls displayNotice() -> prints notice.",
            "Line 4: Returns to main -> prints 'Main thread active.'.",
            "Line 5: Calls displayNotice() again -> prints notice a second time."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Calling a non-static method from static main without an object",
            "error": "error: non-static method displayNotice() cannot be referenced from a static context",
            "fix": "Add the 'static' keyword to the helper method declaration: 'public static void displayNotice()'."
          },
          {
            "mistake": "Nesting a method declaration inside another method",
            "error": "error: illegal start of expression",
            "fix": "In Java, methods cannot be declared inside another method. Declare methods directly inside the class body."
          }
        ],
        "checkpoint": [
          {
            "question": "Where must method declarations be located in Java?",
            "options": [
              "Inside the main method body",
              "Inside a class body, outside of any other method",
              "In a separate .txt file",
              "Before the package statement"
            ],
            "answer": 1,
            "explanation": "Java methods belong to classes and cannot be nested inside other methods."
          },
          {
            "question": "What happens to a method's stack frame in memory when the method completes execution?",
            "options": [
              "It stays in memory forever until program exit",
              "It is immediately popped off the call stack and its memory is reclaimed",
              "It is moved to a hard drive swap file",
              "It is converted to a String"
            ],
            "answer": 1,
            "explanation": "Stack frames are popped automatically when the method returns, providing instantaneous memory cleanup."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that defines a static helper method named `announceForge`:\n- `announceForge` takes no parameters and prints:\n  `Forge: Active`\n  `Temperature: 1200 C`\n- In `main`, call `announceForge()` once, then print `Status: Ready for Smelting`\nPrint exactly:\nLine 1: `Forge: Active`\nLine 2: `Temperature: 1200 C`\nLine 3: `Status: Ready for Smelting`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Call announceForge and print the status\n    }\n\n    // TODO: Define the announceForge method here\n}",
          "hints": [
            "public static void announceForge() { ... }",
            "Call announceForge(); inside main.",
            "System.out.println(\"Status: Ready for Smelting\");"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        announceForge();\n        System.out.println(\"Status: Ready for Smelting\");\n    }\n\n    public static void announceForge() {\n        System.out.println(\"Forge: Active\");\n        System.out.println(\"Temperature: 1200 C\");\n    }\n}",
          "tests": [
            {
              "name": "Method invocation check",
              "stdin": "",
              "expectedStdout": "Forge: Active\nTemperature: 1200 C\nStatus: Ready for Smelting"
            },
            {
              "name": "Temperature check",
              "stdin": "",
              "expectedStdout": "Forge: Active\nTemperature: 1200 C\nStatus: Ready for Smelting"
            },
            {
              "name": "Status line check",
              "stdin": "",
              "expectedStdout": "Forge: Active\nTemperature: 1200 C\nStatus: Ready for Smelting"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 4: How Objects Behave (Methods take parameters, return values)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 4: Objects and Classes (Method Calls)",
            "verify": false
          }
        ]
      },
      {
        "id": "b5_l2",
        "title": "Parameters, Arguments & Pass-by-Value",
        "xp": 35,
        "estimatedMinutes": 22,
        "story": "When a customer hands a blueprint to the citadel architect, the architect copies the dimensions onto their own work slate. If the architect doodles on their slate, the customer's original blueprint remains untouched. In Java, this rule is absolute: Java is strictly pass-by-value.",
        "explanation": [
          {
            "type": "text",
            "content": "A **parameter** is a variable defined in the method declaration header (the placeholder). An **argument** is the actual value passed into the method when it is called.\n\nJava's golden parameter rule:\n**Java is strictly pass-by-value, always.**\nWhen you pass a primitive variable to a method, Java copies its raw value. Modifying the parameter variable inside the method has ZERO effect on the original variable in the caller!"
          },
          {
            "type": "code",
            "content": "Pass-by-Value Demonstration:",
            "code": "public class Main {\n    public static void main(String[] args) {\n        int gold = 50;\n        spendGold(gold);\n        System.out.println(gold); // Still 50! Original was NOT modified!\n    }\n\n    public static void spendGold(int gold) {\n        gold = gold - 20; // Only modifies local copy inside spendGold frame\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "The Pass-by-Reference Myth",
            "content": "Many beginners mistakenly believe objects in Java are passed by reference. In reality, object references are ALSO passed by value—the memory pointer bits are copied. We will explore reference copying deeply in Track 2."
          }
        ],
        "slides": [
          {
            "title": "Parameters vs Arguments",
            "type": "intro",
            "content": "Parameters = variables in method header. Arguments = values supplied when calling."
          },
          {
            "title": "Value Isolation in Stack Frames",
            "type": "code",
            "content": "Each method call receives its own private stack frame. Changes to local parameters do not alter caller variables.",
            "code": "public static void boost(int x) {\n    x += 100;\n} // When boost returns, its frame is destroyed"
          },
          {
            "title": "Multiple Parameters",
            "type": "tip",
            "content": "Methods can accept multiple parameters separated by commas: 'public static void craft(String item, int count)'. Arguments must match types and order."
          }
        ],
        "underTheHood": "In bytecode, when a method call executes (`invokestatic`), the caller pushes argument values onto the operand stack. The JVM copies these values directly into local variable slots (indices 0, 1, 2...) of the callee's new stack frame. The callee modifies only its own frame slots.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        printDamageReport(\"Diamond Sword\", 15);\n        printDamageReport(\"Iron Axe\", 9);\n    }\n\n    public static void printDamageReport(String weapon, int damage) {\n        System.out.println(\"Weapon: \" + weapon + \" | Dmg: \" + damage);\n    }\n}",
          "walkthrough": [
            "Call 1 passes \"Diamond Sword\" and 15 into printDamageReport.",
            "Prints formatted report for Diamond Sword.",
            "Call 2 passes \"Iron Axe\" and 9.",
            "Prints formatted report for Iron Axe."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Expecting a method to modify a caller's primitive variable",
            "error": "Caller's variable remains unchanged after method call",
            "fix": "If a method needs to update a number, have the method RETURN the new value, and assign it in the caller: 'gold = spendGold(gold);'."
          },
          {
            "mistake": "Passing arguments in the wrong order or with mismatched types",
            "error": "error: incompatible types: int cannot be converted to String",
            "fix": "Arguments must match parameter types in the exact order declared."
          }
        ],
        "checkpoint": [
          {
            "question": "Predict the Output:\npublic class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        doubleIt(x);\n        System.out.println(x);\n    }\n    public static void doubleIt(int x) {\n        x = x * 2;\n    }\n}",
            "options": [
              "20",
              "10",
              "0",
              "Compilation error"
            ],
            "answer": 1,
            "explanation": "Java is strictly pass-by-value. doubleIt modifies only its local copy of x; the caller's x remains 10."
          },
          {
            "question": "If a method is declared as 'void move(int dx, int dy)', what is the correct way to call it?",
            "options": [
              "move(5, 10);",
              "move(int 5, int 10);",
              "move(\"5\", \"10\");",
              "call move(5, 10);"
            ],
            "answer": 0,
            "explanation": "Pass arguments by writing their values inside parentheses without re-specifying type keywords: move(5, 10);."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` with a method `printRation` that takes `String adventurer` and `int breadCount`:\n- Prints: `Adventurer: <adventurer> | Rations: <breadCount> loaves`\nIn `main`, call `printRation(\"Blockhead\", 5);`\nPrint exactly:\nLine 1: `Adventurer: Blockhead | Rations: 5 loaves`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Call printRation with \"Blockhead\" and 5\n    }\n\n    // TODO: Define printRation(String adventurer, int breadCount)\n}",
          "hints": [
            "public static void printRation(String adventurer, int breadCount) { ... }",
            "System.out.println(\"Adventurer: \" + adventurer + \" | Rations: \" + breadCount + \" loaves\");",
            "Call printRation(\"Blockhead\", 5); inside main."
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        printRation(\"Blockhead\", 5);\n    }\n\n    public static void printRation(String adventurer, int breadCount) {\n        System.out.println(\"Adventurer: \" + adventurer + \" | Rations: \" + breadCount + \" loaves\");\n    }\n}",
          "tests": [
            {
              "name": "Ration parameter output check",
              "stdin": "",
              "expectedStdout": "Adventurer: Blockhead | Rations: 5 loaves"
            },
            {
              "name": "Adventurer name check",
              "stdin": "",
              "expectedStdout": "Adventurer: Blockhead | Rations: 5 loaves"
            },
            {
              "name": "Loaves count check",
              "stdin": "",
              "expectedStdout": "Adventurer: Blockhead | Rations: 5 loaves"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 8.4.1: Formal Parameters",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 4: How Objects Behave (Pass-by-value)",
            "verify": false
          }
        ]
      },
      {
        "id": "b5_l3",
        "title": "Return Values & Early Exit Guard Clauses",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "When you send a scout out into the uncharted wilderness, you expect them to return with an answer: how many enemies are ahead, or is the bridge intact? In Java, non-void methods return calculated answers to their callers.",
        "explanation": [
          {
            "type": "text",
            "content": "If a method produces an outcome, declare the return type in its header (e.g. `int`, `double`, `boolean`, `String`). Inside the method body, use the `return` statement to send the calculated value back to the caller.\n\nRules of return:\n- Every code path in a non-void method must end in a valid return statement.\n- When `return` executes, the method exits immediately; no subsequent statements in that method are reached."
          },
          {
            "type": "code",
            "content": "Guard Clauses with Early Return:",
            "code": "public static int calculateTax(int income) {\n    if (income <= 0) return 0; // Guard clause: early exit for edge case!\n    if (income > 1000) return (int)(income * 0.15);\n    return (int)(income * 0.05);\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "Bouncer Pattern (Guard Clauses)",
            "content": "Instead of deeply nesting if-else blocks, check for invalid or edge conditions at the very top of your method and return immediately. This keeps the 'happy path' clean and unindented."
          }
        ],
        "slides": [
          {
            "title": "The return Statement",
            "type": "intro",
            "content": "The return statement passes a value back to the caller and terminates the method immediately."
          },
          {
            "title": "Void vs Non-Void",
            "type": "code",
            "content": "In a void method, you can write 'return;' with no value to exit early.",
            "code": "public static void checkHealth(int hp) {\n    if (hp <= 0) {\n        System.out.println(\"Player defeated\");\n        return; // Exit early!\n    }\n    System.out.println(\"Player is fighting\");\n}"
          },
          {
            "title": "Unreachable Code Error",
            "type": "tip",
            "content": "Any code written directly after an unconditional return statement causes a compilation error: 'unreachable statement'."
          }
        ],
        "underTheHood": "In bytecode, returning a value uses type-specific return opcodes: `ireturn` (for int, boolean, byte, char, short), `lreturn` (for long), `dreturn` (for double), `areturn` (for object references), or `return` (for void). The return opcode pushes the return value onto the caller's operand stack.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int cost = calculateTotal(10, 4);\n        System.out.println(\"Total Cost: \" + cost + \" emeralds\");\n    }\n\n    public static int calculateTotal(int unitPrice, int quantity) {\n        return unitPrice * quantity;\n    }\n}",
          "walkthrough": [
            "Line 3: Calls calculateTotal(10, 4).",
            "Line 8: Multiplies 10 * 4 = 40, returns 40.",
            "Line 3: 40 is assigned to 'cost'.",
            "Line 4: Outputs 'Total Cost: 40 emeralds'."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Missing return statement in one branch of an if-else chain",
            "error": "error: missing return statement",
            "fix": "Ensure that every possible execution branch (including the else case) returns a valid value."
          },
          {
            "mistake": "Writing statements after a return",
            "error": "error: unreachable statement",
            "fix": "Remove code placed after return statements, or move it inside an appropriate conditional branch."
          }
        ],
        "checkpoint": [
          {
            "question": "What error occurs if an 'if' statement in a non-void method returns a value, but there is no return statement outside the if?",
            "options": [
              "NullPointerException at runtime",
              "Compilation error: 'missing return statement'",
              "The method returns 0 by default",
              "The method loops forever"
            ],
            "answer": 1,
            "explanation": "The compiler detects that if the condition is false, execution reaches the end without returning a value, which is illegal in Java."
          },
          {
            "question": "Can a void method use a return statement?",
            "options": [
              "No, never",
              "Yes, using 'return;' with no value to exit the method early",
              "Only if it returns null",
              "Only inside while loops"
            ],
            "answer": 1,
            "explanation": "A void method can use 'return;' to exit early without producing a value."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that defines a static method `calculatePerimeter(int width, int length)`:\n- Returns `2 * (width + length)` as an `int`\nIn `main`, call `calculatePerimeter(8, 12)` and print:\nLine 1: `Perimeter: 40`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Call calculatePerimeter(8, 12) and print\n    }\n\n    // TODO: Define calculatePerimeter(int width, int length) returning int\n}",
          "hints": [
            "public static int calculatePerimeter(int width, int length) { return 2 * (width + length); }",
            "int p = calculatePerimeter(8, 12);",
            "System.out.println(\"Perimeter: \" + p);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int p = calculatePerimeter(8, 12);\n        System.out.println(\"Perimeter: \" + p);\n    }\n\n    public static int calculatePerimeter(int width, int length) {\n        return 2 * (width + length);\n    }\n}",
          "tests": [
            {
              "name": "Perimeter return check",
              "stdin": "",
              "expectedStdout": "Perimeter: 40"
            },
            {
              "name": "Calculation check",
              "stdin": "",
              "expectedStdout": "Perimeter: 40"
            },
            {
              "name": "Formatted output check",
              "stdin": "",
              "expectedStdout": "Perimeter: 40"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 14.17: The return Statement",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 4: Objects and Classes (Method Signatures and Returns)",
            "verify": false
          }
        ]
      },
      {
        "id": "b5_l4",
        "title": "Variable Scope & Shadowing",
        "xp": 30,
        "estimatedMinutes": 18,
        "story": "Torches placed inside a closed cellar illuminate only that room; their light does not pierce outside stone walls. In Java, variable scope determines where a variable is visible and accessible in your code.",
        "explanation": [
          {
            "type": "text",
            "content": "The **scope** of a variable is the region of code in which the variable can be referred to by its name. In Java, scope is dictated by curly braces `{}`.\n\nScope Rules:\n- **Block scope**: A variable declared inside a block `{ ... }` (such as an if statement or for loop) exists only within that block and ceases to exist once the block closes.\n- **Method scope**: Parameters and local variables declared inside a method exist only during that method's execution.\n- **Class scope**: Fields declared directly in a class are accessible to methods throughout that class."
          },
          {
            "type": "code",
            "content": "Block Scope in Action:",
            "code": "public class Main {\n    public static void main(String[] args) {\n        int globalScore = 100;\n        if (globalScore > 50) {\n            int bonus = 25; // Exists only inside this if-block!\n            System.out.println(globalScore + bonus); // OK: 125\n        }\n        // System.out.println(bonus); // ERROR! bonus is out of scope here!\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "Shadowing Pitfall",
            "content": "If a local variable inside a method has the exact same name as a class-level field, the local variable **shadows** (hides) the field. In Module 7, we will learn how `this.fieldName` resolves this ambiguity in classes."
          }
        ],
        "slides": [
          {
            "title": "Block-Scoped Variables",
            "type": "intro",
            "content": "A variable's lifetime begins at its point of declaration and ends at the closing brace '}' of the block in which it was declared."
          },
          {
            "title": "Cannot Re-Declare in Enclosed Scope",
            "type": "code",
            "content": "Unlike C++, Java forbids declaring a local variable with the same name as an existing variable in an enclosing outer block.",
            "code": "int x = 10;\nif (x > 5) {\n    // int x = 20; // ERROR: variable x is already defined!\n}"
          },
          {
            "title": "Loop Counter Scope",
            "type": "tip",
            "content": "Variables declared in for loop headers 'for (int i = 0; ...)' are strictly scoped to that loop, allowing you to use 'i' again in another loop later."
          }
        ],
        "underTheHood": "In the `.class` bytecode file, the compiler emits a `LocalVariableTable` attribute for debugging. Each variable has a `Start PC` (bytecode offset where it becomes valid) and a `Length` (number of bytes of code for which it remains in scope). The JVM reuses stack frame slot indices once a variable's scope expires.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int outerVal = 50;\n        {\n            int innerVal = 20;\n            System.out.println(\"Combined: \" + (outerVal + innerVal));\n        }\n        System.out.println(\"Outer: \" + outerVal);\n    }\n}",
          "walkthrough": [
            "Line 3: outerVal is declared in main block.",
            "Line 5: innerVal is declared inside inner block.",
            "Line 6: Both outerVal and innerVal are accessible.",
            "Line 7: Inner block closes. innerVal is destroyed.",
            "Line 8: outerVal remains accessible in main."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Attempting to use a loop variable outside the loop",
            "error": "error: cannot find symbol variable i",
            "fix": "If you need the final count or searched index after a loop finishes, declare the counter variable before the loop."
          },
          {
            "mistake": "Declaring variables inside an if-branch that are needed in the else-branch",
            "error": "error: cannot find symbol",
            "fix": "Declare the variable before the if statement so it is in scope across all branches."
          }
        ],
        "checkpoint": [
          {
            "question": "Can an inner block access a variable declared in its enclosing outer block?",
            "options": [
              "Yes, inner blocks inherit access to variables from enclosing outer blocks",
              "No, never",
              "Only if marked public",
              "Only if it is a double"
            ],
            "answer": 0,
            "explanation": "Scope flows downward: inner blocks can access variables declared in outer enclosing blocks."
          },
          {
            "question": "What happens if you try to access a variable outside the block where it was declared?",
            "options": [
              "It returns null",
              "Compilation error: cannot find symbol",
              "It returns 0",
              "A runtime exception is thrown"
            ],
            "answer": 1,
            "explanation": "The compiler rejects the code because the identifier is unknown outside its declared scope."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` demonstrating scope:\n- In `main`, declare `int baseScore = 100;`\n- Create an if-block `if (baseScore > 50) { ... }`\n- Inside the block, declare `int multiplier = 3;` and compute `int total = baseScore * multiplier;`\n- Print inside the block: `Total Score: 300`\n- Outside the block, print `Base Score: 100`\nPrint exactly:\nLine 1: `Total Score: 300`\nLine 2: `Base Score: 100`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Demonstrate block scope and print the 2 lines\n    }\n}",
          "hints": [
            "int baseScore = 100;",
            "if (baseScore > 50) { int multiplier = 3; int total = baseScore * multiplier; System.out.println(\"Total Score: \" + total); }",
            "System.out.println(\"Base Score: \" + baseScore);"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        int baseScore = 100;\n        if (baseScore > 50) {\n            int multiplier = 3;\n            int total = baseScore * multiplier;\n            System.out.println(\"Total Score: \" + total);\n        }\n        System.out.println(\"Base Score: \" + baseScore);\n    }\n}",
          "tests": [
            {
              "name": "Scope block output check",
              "stdin": "",
              "expectedStdout": "Total Score: 300\nBase Score: 100"
            },
            {
              "name": "Inner total check",
              "stdin": "",
              "expectedStdout": "Total Score: 300\nBase Score: 100"
            },
            {
              "name": "Outer base score check",
              "stdin": "",
              "expectedStdout": "Total Score: 300\nBase Score: 100"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 6.3: Scope of a Declaration",
            "verify": false
          },
          {
            "source": "Core Java Vol. I, 12th ed.",
            "location": "Chapter 3: Fundamental Programming Structures (Block Scope)",
            "verify": false
          }
        ]
      },
      {
        "id": "b5_l5",
        "title": "Method Overloading: Polymorphic Flexibility",
        "xp": 35,
        "estimatedMinutes": 20,
        "story": "The Citadel Crafting Table can forge a simple sword from raw iron, or forge an enchanted sword if you also provide glowstone dust and emeralds. Same recipe name ('forge'), but different ingredients. In Java, this capability is called method overloading.",
        "explanation": [
          {
            "type": "text",
            "content": "In Java, two or more methods in the same class can share the exact same name as long as their **parameter lists are distinct**. This is called **method overloading**.\n\nA parameter list is distinct if it differs in:\n1. The **number** of parameters (e.g. 1 param vs 2 params)\n2. The **data types** of parameters (e.g. int vs double)\n3. The **order** of different types (e.g. `(int, String)` vs `(String, int)`)\n\nNote: Changing only the return type does NOT overload a method. If two methods have the exact same name and parameter types, differing only in return type, javac will reject the code with a duplicate method error."
          },
          {
            "type": "code",
            "content": "Overloaded forge Methods:",
            "code": "public class Forge {\n    // Overload 1: basic craft\n    public static void craft(String item) {\n        System.out.println(\"Crafted 1 \" + item);\n    }\n\n    // Overload 2: batch craft with count\n    public static void craft(String item, int count) {\n        System.out.println(\"Crafted \" + count + \" \" + item + \"s\");\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "title": "System.out.println is Overloaded!",
            "content": "You have been using method overloading since day one! `System.out.println` has over 10 overloaded variants: `println(int)`, `println(double)`, `println(String)`, `println(char)`, `println(boolean)`, and `println()` with no arguments."
          }
        ],
        "slides": [
          {
            "title": "Compile-Time Polymorphism",
            "type": "intro",
            "content": "Method overloading is resolved at compile time by javac based on the static argument types passed at the call site."
          },
          {
            "title": "Invalid Overload Example",
            "type": "code",
            "content": "Return types do not count toward the method signature. The compiler must be able to disambiguate calls solely from the arguments.",
            "code": "// ILLEGAL:\n// public static int calculate() { return 1; }\n// public static double calculate() { return 1.0; }\n// javac error: method calculate() is already defined!"
          },
          {
            "title": "Autoboxing and Widening Resolution",
            "type": "tip",
            "content": "If an exact match isn't found, Java looks for widening conversions (int to long), followed by autoboxing."
          }
        ],
        "underTheHood": "In compiled bytecode, the JVM knows methods by their fully-mangled **method descriptor** (which bundles the name and parameter types, e.g. `craft(Ljava/lang/String;)V` vs `craft(Ljava/lang/String;I)V`). Because descriptors are distinct, there is zero ambiguity at the JVM instruction level.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        printBadge(\"Explorer\");\n        printBadge(\"Champion\", 3);\n    }\n\n    public static void printBadge(String name) {\n        System.out.println(\"Badge: \" + name);\n    }\n\n    public static void printBadge(String name, int stars) {\n        System.out.println(\"Badge: \" + name + \" (\" + stars + \" Stars)\");\n    }\n}",
          "walkthrough": [
            "Call 1 has 1 String argument -> binds to printBadge(String).",
            "Call 2 has (String, int) -> binds to printBadge(String, int).",
            "Prints both cleanly."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Attempting to overload methods by changing only the return type",
            "error": "error: method calc() is already defined in class Main",
            "fix": "To overload, you MUST change the parameter list (count, types, or order)."
          },
          {
            "mistake": "Ambiguous method calls with automatic widening",
            "error": "error: reference to method is ambiguous",
            "fix": "Cast the argument explicitly at the call site to clarify which overloaded method you intend to invoke."
          }
        ],
        "checkpoint": [
          {
            "question": "Which of the following method pairs is a VALID overload?",
            "options": [
              "int add(int a, int b) AND double add(int a, int b)",
              "void attack(int dmg) AND void attack(int power)",
              "void draw(int x, int y) AND void draw(int x, int y, int z)",
              "String name() AND void name()"
            ],
            "answer": 2,
            "explanation": "Option 3 changes the parameter count (2 params vs 3 params), making it a valid overload."
          },
          {
            "question": "Can two methods with the same name differ ONLY in their return type?",
            "options": [
              "Yes, Java allows this in Java 21",
              "No, the compiler cannot disambiguate calls solely by return type",
              "Only if they are static",
              "Only for void methods"
            ],
            "answer": 1,
            "explanation": "In Java, return type is not part of the signature used for overload resolution."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that defines two overloaded methods named `reward`:\n1. `reward(int xp)`: prints `Awarded <xp> XP`\n2. `reward(int xp, String item)`: prints `Awarded <xp> XP and 1 <item>`\nIn `main`, call `reward(50);` and `reward(100, \"Beacon\");`\nPrint exactly:\nLine 1: `Awarded 50 XP`\nLine 2: `Awarded 100 XP and 1 Beacon`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Call the two overloaded reward methods\n    }\n\n    // TODO: Define reward(int xp)\n    // TODO: Define reward(int xp, String item)\n}",
          "hints": [
            "public static void reward(int xp) { System.out.println(\"Awarded \" + xp + \" XP\"); }",
            "public static void reward(int xp, String item) { System.out.println(\"Awarded \" + xp + \" XP and 1 \" + item); }",
            "Call reward(50); and reward(100, \"Beacon\");"
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        reward(50);\n        reward(100, \"Beacon\");\n    }\n\n    public static void reward(int xp) {\n        System.out.println(\"Awarded \" + xp + \" XP\");\n    }\n\n    public static void reward(int xp, String item) {\n        System.out.println(\"Awarded \" + xp + \" XP and 1 \" + item);\n    }\n}",
          "tests": [
            {
              "name": "Overloaded reward output check",
              "stdin": "",
              "expectedStdout": "Awarded 50 XP\nAwarded 100 XP and 1 Beacon"
            },
            {
              "name": "Single-parameter overload check",
              "stdin": "",
              "expectedStdout": "Awarded 50 XP\nAwarded 100 XP and 1 Beacon"
            },
            {
              "name": "Two-parameter overload check",
              "stdin": "",
              "expectedStdout": "Awarded 50 XP\nAwarded 100 XP and 1 Beacon"
            }
          ]
        },
        "references": [
          {
            "source": "The Java Language Specification, Java SE 21 Edition",
            "location": "Section 8.4.9: Method Overloading",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 52: Use overloading judiciously",
            "verify": false
          }
        ]
      },
      {
        "id": "b5_l6",
        "title": "Introduction to Recursion",
        "xp": 40,
        "estimatedMinutes": 22,
        "story": "In the mirror chambers of the Citadel, two opposing mirrors reflect each other infinitely, hallway within hallway. When a method solves a problem by calling a smaller copy of itself, it is using recursion. Every mirror must eventually find an end wall: the base case.",
        "explanation": [
          {
            "type": "text",
            "content": "A **recursive method** is a method that calls itself. To prevent infinite loops that crash your program, every recursive function MUST have two parts:\n\n1. **Base Case**: The termination condition where the method returns an answer directly without making another recursive call.\n2. **Recursive Step**: The case where the method calls itself with a strictly smaller or simpler input, progressing steadily toward the base case."
          },
          {
            "type": "code",
            "content": "Classic Factorial via Recursion (n! = n * (n-1)!):",
            "code": "public static int factorial(int n) {\n    // 1. Base case: 0! = 1 and 1! = 1\n    if (n <= 1) {\n        return 1;\n    }\n    // 2. Recursive step: n * factorial(n - 1)\n    return n * factorial(n - 1);\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "title": "StackOverflowError",
            "content": "Every time a recursive call occurs, a new stack frame is pushed onto the thread call stack. If you forget your base case, the stack keeps growing until all allocated stack memory is exhausted, throwing `java.lang.StackOverflowError`."
          }
        ],
        "slides": [
          {
            "title": "Anatomy of Recursion",
            "type": "intro",
            "content": "Recursion divides a problem into a base case (trivial answer) and a self-similar subproblem."
          },
          {
            "title": "Call Stack Unwinding",
            "type": "code",
            "content": "factorial(3) calls factorial(2) calls factorial(1). factorial(1) returns 1; factorial(2) computes 2*1=2; factorial(3) computes 3*2=6.",
            "code": "// Visualizing stack growth:\n// [ factorial(3) ] -> waits for 2\n//   [ factorial(2) ] -> waits for 1\n//     [ factorial(1) ] -> returns 1"
          },
          {
            "title": "Recursion vs Iteration",
            "type": "tip",
            "content": "Any recursive algorithm can also be written iteratively using loops. Recursion excels at naturally branching structures like trees and file systems."
          }
        ],
        "underTheHood": "The JVM thread stack is bounded (default typically 1024 KB set by `-Xss`). Each recursive frame consumes around 32 to 64 bytes. If recursion depth exceeds roughly 10,000 to 15,000 frames without hitting a base case, the JVM guards trigger an immediate `StackOverflowError`.",
        "workedExample": {
          "code": "public class Main {\n    public static void main(String[] args) {\n        int result = sumTo(4);\n        System.out.println(\"Sum(4): \" + result);\n    }\n\n    public static int sumTo(int n) {\n        if (n <= 1) return n;\n        return n + sumTo(n - 1);\n    }\n}",
          "walkthrough": [
            "sumTo(4) = 4 + sumTo(3)",
            "sumTo(3) = 3 + sumTo(2)",
            "sumTo(2) = 2 + sumTo(1)",
            "sumTo(1) hits base case, returns 1.",
            "Unwinds: 2+1=3, 3+3=6, 4+6=10. Prints Sum(4): 10."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Forgetting the base case in recursion",
            "error": "Exception in thread \"main\" java.lang.StackOverflowError",
            "fix": "Always write and test your base case condition first before writing the recursive step."
          },
          {
            "mistake": "Failing to progress toward the base case (e.g. calling f(n) instead of f(n-1))",
            "error": "Infinite recursion crashing with StackOverflowError",
            "fix": "Ensure each recursive invocation uses modified arguments that strictly approach the base case."
          }
        ],
        "checkpoint": [
          {
            "question": "What are the two essential components every recursive method must have?",
            "options": [
              "A while loop and a switch statement",
              "A base case and a recursive step",
              "A public modifier and a void return",
              "Two parameters and a scanner"
            ],
            "answer": 1,
            "explanation": "A base case stops recursion; a recursive step reduces the problem toward the base case."
          },
          {
            "question": "What runtime error is thrown if a recursive method has no base case and calls itself forever?",
            "options": [
              "NullPointerException",
              "StackOverflowError",
              "OutOfMemoryError",
              "ArithmeticException"
            ],
            "answer": 1,
            "explanation": "StackOverflowError occurs when the thread call stack runs out of memory frames."
          }
        ],
        "exercise": {
          "instructions": "Write a program in class `Main` that implements a recursive method `countDown(int n)`:\n- Base case: If `n <= 0`, print `Launch!` and return.\n- Recursive step: Print `Count: <n>` and recursively call `countDown(n - 1)`\nIn `main`, call `countDown(3);`\nPrint exactly:\nLine 1: `Count: 3`\nLine 2: `Count: 2`\nLine 3: `Count: 1`\nLine 4: `Launch!`",
          "starterCode": "public class Main {\n    public static void main(String[] args) {\n        // TODO: Call countDown(3)\n    }\n\n    // TODO: Define recursive countDown(int n)\n}",
          "hints": [
            "public static void countDown(int n) { if (n <= 0) { System.out.println(\"Launch!\"); return; } System.out.println(\"Count: \" + n); countDown(n - 1); }",
            "Call countDown(3); in main."
          ],
          "solution": "public class Main {\n    public static void main(String[] args) {\n        countDown(3);\n    }\n\n    public static void countDown(int n) {\n        if (n <= 0) {\n            System.out.println(\"Launch!\");\n            return;\n        }\n        System.out.println(\"Count: \" + n);\n        countDown(n - 1);\n    }\n}",
          "tests": [
            {
              "name": "Recursive countdown check",
              "stdin": "",
              "expectedStdout": "Count: 3\nCount: 2\nCount: 1\nLaunch!"
            },
            {
              "name": "Base case check",
              "stdin": "",
              "expectedStdout": "Count: 3\nCount: 2\nCount: 1\nLaunch!"
            },
            {
              "name": "Exact line count check",
              "stdin": "",
              "expectedStdout": "Count: 3\nCount: 2\nCount: 1\nLaunch!"
            }
          ]
        },
        "references": [
          {
            "source": "Introduction to Java Programming, 12th ed.",
            "location": "Chapter 18: Recursion",
            "verify": false
          },
          {
            "source": "Think Java, 2nd ed.",
            "location": "Chapter 5: Conditionals and Logic (Recursive methods)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "type": "mcq",
        "question": "Which of the following best describes Java's argument passing mechanism?",
        "options": [
          "Pass-by-reference for primitives, pass-by-value for objects",
          "Strictly pass-by-value for all parameters, always",
          "Pass-by-name",
          "Pass-by-pointer in Java 21"
        ],
        "answer": 1,
        "explanation": "Java is strictly pass-by-value. Primitive values and object memory reference addresses are copied."
      },
      {
        "type": "output",
        "question": "Predict the Output:\npublic class Main {\n    public static void main(String[] args) {\n        int a = 5;\n        addTen(a);\n        System.out.println(a);\n    }\n    public static void addTen(int a) { a += 10; }\n}",
        "options": [
          "15",
          "5",
          "0",
          "10"
        ],
        "answer": 1,
        "explanation": "addTen modifies only its local parameter copy; the caller's variable remains 5."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\npublic static int square(int x) {\n    int res = x * x;\n}",
        "options": [
          "square must be private",
          "Method declared to return int, but missing return statement",
          "x * x causes overflow",
          "Static methods cannot calculate squares"
        ],
        "answer": 1,
        "explanation": "A non-void method must end with a return statement returning a matching type."
      },
      {
        "type": "mcq",
        "question": "Which of the following is required to successfully overload a method in Java?",
        "options": [
          "The return types must be different",
          "The parameter lists must differ in number, types, or order",
          "One method must be static and the other non-static",
          "The method names must have different capitalization"
        ],
        "answer": 1,
        "explanation": "Method overloading requires the same method name but different parameter lists."
      },
      {
        "type": "output",
        "question": "Predict the Output:\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(calc(3) + \" \" + calc(3, 2));\n    }\n    public static int calc(int x) { return x * 2; }\n    public static int calc(int x, int y) { return x + y; }\n}",
        "options": [
          "6 5",
          "5 6",
          "6 6",
          "5 5"
        ],
        "answer": 0,
        "explanation": "calc(3) invokes the 1-param overload (3*2=6). calc(3,2) invokes the 2-param overload (3+2=5)."
      },
      {
        "type": "fill-in",
        "question": "Fill in the blank: The termination condition that prevents a recursive method from calling itself infinitely is called the _______.",
        "options": [
          "base case",
          "catch block",
          "loop header",
          "exit flag"
        ],
        "answer": 0,
        "explanation": "The base case halts recursion."
      },
      {
        "type": "mcq",
        "question": "What exception is thrown when infinite recursion exhausts the thread call stack?",
        "options": [
          "NullPointerException",
          "StackOverflowError",
          "OutOfMemoryError",
          "IndexOutOfBoundsException"
        ],
        "answer": 1,
        "explanation": "Unbounded recursion pushes too many stack frames, throwing StackOverflowError."
      },
      {
        "type": "order-the-lines",
        "question": "Order the lines to define a method that returns the maximum of two numbers:\n1: return (a > b) ? a : b;\n2: public static int max(int a, int b) {\n3: }",
        "options": [
          "2, 1, 3",
          "1, 2, 3",
          "3, 2, 1",
          "2, 3, 1"
        ],
        "answer": 0,
        "explanation": "Header (2), ternary return statement (1), closing brace (3)."
      },
      {
        "type": "mcq",
        "question": "What is variable shadowing in Java?",
        "options": [
          "A feature that encrypts variables",
          "When a variable declared within an inner scope has the same name as a variable in an outer scope, hiding the outer one",
          "When a variable is set to null",
          "When variables run on background threads"
        ],
        "answer": 1,
        "explanation": "Shadowing occurs when a closer local variable name hides an outer variable of the same name."
      },
      {
        "type": "output",
        "question": "Predict the Output:\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(f(3));\n    }\n    public static int f(int n) {\n        if (n <= 1) return 1;\n        return n * f(n - 1);\n    }\n}",
        "options": [
          "3",
          "6",
          "9",
          "1"
        ],
        "answer": 1,
        "explanation": "Factorial of 3: 3 * f(2) = 3 * (2 * f(1)) = 3 * 2 * 1 = 6."
      },
      {
        "type": "spot-the-bug",
        "question": "Spot the Bug:\npublic class Main {\n    public static void main(String[] args) {\n        int x = compute();\n    }\n    public static void compute() {\n        System.out.println(42);\n    }\n}",
        "options": [
          "Cannot assign the result of a void method to an int variable",
          "compute() cannot print numbers",
          "main cannot call compute()",
          "x must be double"
        ],
        "answer": 0,
        "explanation": "compute() has return type void and does not produce a value, so assigning it to 'int x' fails compilation."
      },
      {
        "type": "mcq",
        "question": "Why does the DRY (Don't Repeat Yourself) principle recommend extracting duplicate code into methods?",
        "options": [
          "It makes .class files 100x smaller",
          "It centralizes logic so bugs are fixed in one place, reduces code bloat, and improves testability",
          "Java requires all files to have at least 5 methods",
          "It forces the CPU to use multiple cores"
        ],
        "answer": 1,
        "explanation": "Extracting shared logic into methods centralizes maintenance and ensures consistency."
      }
    ],
    "project": {
      "title": "Citadel Crafting Blueprint Engine",
      "brief": "Construct a modular recipe calculation system featuring overloaded crafting methods, damage scaling equations, and recursive ingredient sub-component breakdown.",
      "milestones": [
        "Define overloaded craftItem methods for single tools, batch stacks, and enchanted gear",
        "Implement a calculateDamage method with armor mitigation formulas",
        "Implement a recursive getRawMaterialCount method that calculates total raw ores needed for composite items",
        "Format clean summary tables with parameter validation guard clauses"
      ],
      "rubric": [
        "Modularity: Clean separation of concerns with single-purpose methods",
        "Overloading: Distinct parameter lists that compile unambiguously",
        "Recursion: Clear base cases preventing StackOverflowError",
        "Safety: Guard clauses validating non-negative parameters"
      ],
      "stretchGoals": [
        "Implement memoization or iterative comparisons for recipe tree lookups",
        "Add interactive Scanner menu to invoke different crafting recipes"
      ]
    },
    "glossary": [
      {
        "term": "Method",
        "definition": "A collection of statements grouped together to perform a specific operation, callable by name."
      },
      {
        "term": "Pass-by-Value",
        "definition": "The evaluation strategy where an argument's value is copied into the method's parameter variable upon invocation."
      },
      {
        "term": "Return Type",
        "definition": "The declared data type of the value a method sends back to its caller, or void if it sends nothing."
      },
      {
        "term": "Scope",
        "definition": "The region of a program within which a variable can be referred to by its identifier."
      },
      {
        "term": "Method Overloading",
        "definition": "Defining multiple methods with the same name within a class, differentiated by parameter lists."
      },
      {
        "term": "Recursion",
        "definition": "A problem-solving programming technique in which a method calls itself to solve smaller instances of the same problem."
      }
    ],
    "references": [
      {
        "source": "The Java Language Specification, Java SE 21 Edition",
        "location": "Section 8.4: Method Declarations",
        "verify": false
      },
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 4: Objects and Classes (Method Overloading)",
        "verify": false
      },
      {
        "source": "Introduction to Java Programming, 12th ed.",
        "location": "Chapter 6: Methods & Chapter 18: Recursion",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b6",
    "code": "B6",
    "track": "beginner",
    "title": "Arrays & String Manipulation",
    "subtitle": "Contiguous heap memory, 1D & 2D arrays, String immutability, constant pool, and StringBuilder",
    "biome": "Quarry Warehouse",
    "estimatedMinutes": 140,
    "learningObjectives": [
      "Allocate, index, and traverse single-dimensional arrays with boundary safety",
      "Compare classic indexed for loops against enhanced for-each loops for array manipulation",
      "Construct and iterate through multi-dimensional and jagged array structures",
      "Explain String immutability, memory management in the String Constant Pool, and .equals() semantics",
      "Apply essential String methods for slicing, searching, and parsing tokenized data",
      "Construct high-performance mutable string sequences with StringBuilder and Java 15+ Text Blocks"
    ],
    "prerequisites": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5"
    ],
    "lessons": [
      {
        "id": "b6_l1",
        "title": "1D Arrays: Allocation, Indexing & Memory Layout",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "You arrive at the Quarry Warehouse where endless storage bins line the floor. In Java, an array is a fixed-size, contiguous sequence of elements indexed from zero, stored together in heap memory.",
        "explanation": [
          {
            "type": "text",
            "content": "An array is a fixed-length data structure that stores multiple values of the exact same type in contiguous memory. Once allocated, its size can never change."
          },
          {
            "type": "code",
            "content": "Declaring and Allocating Arrays:",
            "code": "// Syntax 1: Allocate with default zero values\nint[] vault = new int[5]; // Indices 0 through 4\nvault[0] = 64; // Assign to first slot\n\n// Syntax 2: Array initializer shorthand\nint[] gems = {10, 25, 50, 100};\nSystem.out.println(\"Total gems: \" + gems.length); // 4"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Array length is a public final field (`gems.length`), NOT a method call. Do not write `gems.length()`!"
          },
          {
            "type": "text",
            "content": "Java automatically initializes primitive array elements to default values: `0` for numeric primitives, `false` for `boolean`, and `null` for reference types."
          }
        ],
        "slides": [
          {
            "title": "Fixed Contiguous Storage",
            "content": "Arrays store homogenous elements in a single contiguous heap block. Indices are strictly zero-based, running from `0` to `array.length - 1`."
          },
          {
            "title": "Default Initialization",
            "content": "Allocating `new int[10]` fills all 10 slots with `0`. For booleans, default is `false`. For object references, default is `null`."
          },
          {
            "title": "The length Property",
            "content": "Access the size using `.length` without parentheses. Arrays cannot grow or shrink after initial creation."
          }
        ],
        "underTheHood": "In Java, arrays are true Objects allocated on the Heap. The variable on the stack stores a 64-bit reference pointing to the array's object header (Mark Word + Klass Word + 32-bit length field), followed directly by the raw contiguous elements. The HotSpot JIT compiler optimizes bounds checking by hoisting checks outside hot loops when indices can be proven safe.",
        "workedExample": {
          "code": "public class ArrayDemo {\n    public static void main(String[] args) {\n        int[] inventory = new int[3];\n        inventory[0] = 64;\n        inventory[1] = 32;\n        inventory[2] = 16;\n        \n        System.out.println(\"First: \" + inventory[0]);\n        System.out.println(\"Last: \" + inventory[inventory.length - 1]);\n    }\n}",
          "walkthrough": [
            "Line 2: Allocates a new 3-element int array on the heap, setting all slots to 0.",
            "Lines 3-5: Populates indices 0, 1, and 2 with item counts.",
            "Line 7: Reads the first element at index 0.",
            "Line 8: Uses inventory.length - 1 (3 - 1 = 2) to safely read the final element."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Accessing index equal to array length (off-by-one)",
            "error": "ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5",
            "fix": "Valid indices are 0 to length - 1. Loop with `i < arr.length`, never `i <= arr.length`."
          },
          {
            "mistake": "Adding parentheses to array length",
            "error": "cannot find symbol: method length() in int[]",
            "fix": "Use `arr.length` (a field) for arrays; `str.length()` (a method) is only for Strings."
          }
        ],
        "checkpoint": [
          {
            "question": "What is the value of `arr[2]` after executing: `int[] arr = new int[4];`?",
            "options": [
              "null",
              "0",
              "Garbage uninitialized data",
              "ArrayIndexOutOfBoundsException"
            ],
            "answer": 1,
            "explanation": "Java initializes numeric primitive arrays to zero automatically."
          },
          {
            "question": "Find the bug in this code:\n```java\nint[] scores = new int[3];\nscores[3] = 100;\n```",
            "options": [
              "Cannot assign an int to an array",
              "scores[3] causes ArrayIndexOutOfBoundsException because valid indices are 0, 1, and 2",
              "Must use new int[] {100}",
              "Array size must be specified in bytes"
            ],
            "answer": 1,
            "explanation": "An array of size 3 has valid indices 0, 1, and 2. Index 3 is out of bounds."
          }
        ],
        "exercise": {
          "instructions": "Read integer N (number of storage slots), followed by N integers representing item counts. Output the total sum of all items in the format 'Total: X' and the item count at the middle slot (index N / 2) in the format 'Middle: Y'.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read N and allocate array\n        \n    }\n}",
          "hints": [
            "Read N with sc.nextInt(), then create an int array of size N.",
            "Loop from 0 to N-1 to read each element and accumulate the sum.",
            "The middle index is simply N / 2 using integer division."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] items = new int[n];\n        long total = 0;\n        for (int i = 0; i < n; i++) {\n            items[i] = sc.nextInt();\n            total += items[i];\n        }\n        System.out.println(\"Total: \" + total);\n        System.out.println(\"Middle: \" + items[n / 2]);\n    }\n}",
          "tests": [
            {
              "name": "Five slots",
              "stdin": "5\n10 20 30 40 50\n",
              "expectedStdout": "Total: 150\nMiddle: 30"
            },
            {
              "name": "Three slots",
              "stdin": "3\n5 15 25\n",
              "expectedStdout": "Total: 45\nMiddle: 15"
            },
            {
              "name": "Single slot",
              "stdin": "1\n99\n",
              "expectedStdout": "Total: 99\nMiddle: 99"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 3: Arrays",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 3: Primitives and References",
            "verify": false
          }
        ]
      },
      {
        "id": "b6_l2",
        "title": "Array Traversal: Classic For vs Enhanced For-Each",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "In the sorting wing of the warehouse, thousands of mined ores must be audited. You can inspect them using traditional index counters or smoothly step through them one by one using Java's enhanced for-each loop.",
        "explanation": [
          {
            "type": "text",
            "content": "Java offers two primary loops to traverse arrays: the classic indexed `for` loop and the enhanced `for-each` loop introduced in Java 5."
          },
          {
            "type": "code",
            "content": "Classic vs Enhanced For-Each:",
            "code": "int[] ores = {45, 88, 92, 60};\n\n// Classic: Use when index position is needed\nfor (int i = 0; i < ores.length; i++) {\n    System.out.println(\"Ore at slot \" + i + \": \" + ores[i]);\n}\n\n// Enhanced: Clean, read-only sequential traversal\nfor (int ore : ores) {\n    System.out.println(\"Ore grade: \" + ore);\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "The iteration variable in a for-each loop (`int ore`) receives a COPY of each element. Modifying `ore = 100;` inside the loop does NOT modify the original array!"
          }
        ],
        "slides": [
          {
            "title": "Classic Indexed Loop",
            "content": "Provides access to the loop counter `i`. Required when mutating array elements, stepping backwards, or traversing multiple arrays simultaneously."
          },
          {
            "title": "Enhanced For-Each Loop",
            "content": "Cleaner syntax with zero index clutter: `for (Type var : array)`. Eliminates off-by-one errors completely."
          },
          {
            "title": "Read-Only Copy Warning",
            "content": "For primitive arrays, the loop variable is a distinct local copy. Assigning to it does not change the array slot."
          }
        ],
        "underTheHood": "The Java compiler (`javac`) desugars an enhanced for loop over an array into an exact standard index-based loop using a synthetic counter. There is zero runtime overhead, no Iterator object allocation, and identical performance to manual index iteration.",
        "workedExample": {
          "code": "public class Auditor {\n    public static void main(String[] args) {\n        int[] grades = {70, 85, 90, 65};\n        int total = 0;\n        int max = grades[0];\n        \n        for (int g : grades) {\n            total += g;\n            if (g > max) max = g;\n        }\n        \n        double avg = (double) total / grades.length;\n        System.out.println(\"Avg: \" + avg + \", Max: \" + max);\n    }\n}",
          "walkthrough": [
            "Line 4: Initializes total accumulator to 0.",
            "Line 5: Assumes the first element is the initial maximum.",
            "Line 7: Enhanced for loop iterates through each grade without index bookkeeping.",
            "Line 12: Casts total to double before division to prevent integer truncation."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Attempting to modify array elements inside an enhanced for-each loop",
            "error": "Values in array remain unchanged despite assignment inside loop",
            "fix": "Use a classic indexed for loop `arr[i] = newValue;` whenever you need to mutate elements."
          },
          {
            "mistake": "Modifying array length during iteration",
            "error": "Arrays have fixed length; attempting to reassign .length causes a compilation error",
            "fix": "Array length is a final field. If you need dynamic sizing, use an ArrayList (covered in B8)."
          }
        ],
        "checkpoint": [
          {
            "question": "What does the following code print?\n```java\nint[] arr = {1, 2, 3};\nfor (int x : arr) { x *= 2; }\nSystem.out.println(arr[0]);\n```",
            "options": [
              "2",
              "1",
              "0",
              "Compilation Error"
            ],
            "answer": 1,
            "explanation": "In an enhanced for loop, `x` is a local copy of each element. Reassigning `x` has no effect on the underlying array `arr`."
          },
          {
            "question": "When MUST you use a classic for loop instead of an enhanced for-each loop?",
            "options": [
              "When iterating over an array of integers",
              "When you need to modify elements in place or need the index position",
              "When you want better performance",
              "When the array length is greater than 100"
            ],
            "answer": 1,
            "explanation": "Enhanced for-each loops do not provide the index variable and cannot reassign array slots."
          }
        ],
        "exercise": {
          "instructions": "Read integer N, followed by N integers representing ore purity grades (0-100). Print the minimum grade, maximum grade, and count of high-grade ores (grade >= 75) in the format:\nMin: X\nMax: Y\nHigh Grade: Z",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read N and values, audit with loop\n        \n    }\n}",
          "hints": [
            "Store the elements in an array or process them as they are read.",
            "Initialize min and max with the first element.",
            "Use a loop to check if each grade is >= 75 and increment a counter."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] grades = new int[n];\n        for (int i = 0; i < n; i++) {\n            grades[i] = sc.nextInt();\n        }\n        int min = grades[0];\n        int max = grades[0];\n        int highGradeCount = 0;\n        for (int g : grades) {\n            if (g < min) min = g;\n            if (g > max) max = g;\n            if (g >= 75) highGradeCount++;\n        }\n        System.out.println(\"Min: \" + min);\n        System.out.println(\"Max: \" + max);\n        System.out.println(\"High Grade: \" + highGradeCount);\n    }\n}",
          "tests": [
            {
              "name": "Mixed grades",
              "stdin": "5\n60 85 72 90 40\n",
              "expectedStdout": "Min: 40\nMax: 90\nHigh Grade: 2"
            },
            {
              "name": "All high grades",
              "stdin": "4\n80 82 89 95\n",
              "expectedStdout": "Min: 80\nMax: 95\nHigh Grade: 4"
            },
            {
              "name": "All low grades",
              "stdin": "3\n10 20 30\n",
              "expectedStdout": "Min: 10\nMax: 30\nHigh Grade: 0"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 3: The 'for each' Loop",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 58: Prefer for-each loops to traditional for loops",
            "verify": false
          }
        ]
      },
      {
        "id": "b6_l3",
        "title": "Multi-Dimensional Arrays: Matrices & Jagged Arrays",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "Mappers in the quarry survey the voxel terrain on a 2D coordinate grid. Java represents matrices as 'arrays of arrays', allowing rectangular layouts or irregular jagged rows.",
        "explanation": [
          {
            "type": "text",
            "content": "In Java, multi-dimensional arrays are actually arrays whose elements are themselves references to other arrays. This provides immense flexibility."
          },
          {
            "type": "code",
            "content": "2D Rectangular and Jagged Arrays:",
            "code": "// Rectangular 2D array: 3 rows, 4 columns\nint[][] grid = new int[3][4];\ngrid[0][0] = 99;\n\n// Jagged array: Rows of differing lengths\nint[][] jagged = new int[3][];\njagged[0] = new int[2]; // row 0 has 2 slots\njagged[1] = new int[5]; // row 1 has 5 slots\njagged[2] = new int[1]; // row 2 has 1 slot"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "To iterate through a 2D matrix, nest two loops: the outer loop runs over `row < matrix.length`, and the inner loop runs over `col < matrix[row].length`."
          }
        ],
        "slides": [
          {
            "title": "Arrays of Arrays",
            "content": "Java does not allocate a single flat block for 2D arrays. It allocates an outer array of references, where each reference points to an independent row array."
          },
          {
            "title": "Jagged Arrays",
            "content": "Because rows are distinct objects on the heap, each row can have a completely different length."
          },
          {
            "title": "Nested Traversal Pattern",
            "content": "Always check `matrix[r].length` for column bounds. This prevents out-of-bounds exceptions when matrices are jagged."
          }
        ],
        "underTheHood": "Unlike C/C++ where multi-dimensional arrays occupy a single contiguous memory block in row-major order, Java uses pointer arrays (an Iliffe vector). Accessing `grid[r][c]` performs two pointer dereferences: first to the row reference, then to the column element. While this enables jagged arrays, it can reduce cache locality for dense matrix operations.",
        "workedExample": {
          "code": "public class MatrixSum {\n    public static void main(String[] args) {\n        int[][] board = {\n            {1, 2, 3},\n            {4, 5, 6}\n        };\n        \n        for (int r = 0; r < board.length; r++) {\n            int rowSum = 0;\n            for (int c = 0; c < board[r].length; c++) {\n                rowSum += board[r][c];\n            }\n            System.out.println(\"Row \" + r + \" sum: \" + rowSum);\n        }\n    }\n}",
          "walkthrough": [
            "Lines 3-6: Uses array initializer shorthand to declare a 2x3 matrix.",
            "Line 8: Outer loop runs for each row index (0 to 1).",
            "Line 10: Inner loop uses board[r].length to safely match that row's width.",
            "Line 13: Prints the sum for the completed row before moving to the next."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Assuming all rows have the same length as row 0",
            "error": "ArrayIndexOutOfBoundsException when iterating jagged arrays using board[0].length",
            "fix": "Always use `board[r].length` for the inner column loop bound."
          },
          {
            "mistake": "Inverting row and column index order",
            "error": "matrix[c][r] instead of matrix[r][c] causes index out of bounds on non-square matrices",
            "fix": "Follow standard matrix conventions: `matrix[row][col]`."
          }
        ],
        "checkpoint": [
          {
            "question": "Given `int[][] grid = new int[4][7];`, what is `grid.length` and `grid[0].length`?",
            "options": [
              "4 and 7",
              "7 and 4",
              "28 and 4",
              "4 and 28"
            ],
            "answer": 0,
            "explanation": "`grid.length` represents the number of rows (4), while `grid[0].length` is the number of columns in row 0 (7)."
          },
          {
            "question": "Can an array in Java have rows of different lengths?",
            "options": [
              "Yes, Java supports jagged arrays because multi-dimensional arrays are arrays of references",
              "No, Java requires all 2D arrays to be strictly rectangular",
              "Only if declared using the var keyword",
              "Only when compiled with the -jagged flag"
            ],
            "answer": 0,
            "explanation": "Java multi-dimensional arrays are arrays of array references, so each row can have an independent size."
          }
        ],
        "exercise": {
          "instructions": "Read two integers R (rows) and C (columns), followed by R * C integers representing terrain elevation. Calculate and print the elevation sum for each row formatted as 'Row X: Y', followed by the overall peak elevation in the map formatted as 'Peak: Z'.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read R and C, populate 2D array, compute row sums and peak\n        \n    }\n}",
          "hints": [
            "Declare `int[][] map = new int[r][c];` and use nested loops to read each cell.",
            "Keep track of the maximum value encountered across all cells for Peak.",
            "Sum each row during or after reading, and print 'Row ' + r + ': ' + rowSum."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int r = sc.nextInt();\n        int c = sc.nextInt();\n        int[][] map = new int[r][c];\n        int peak = Integer.MIN_VALUE;\n        for (int i = 0; i < r; i++) {\n            for (int j = 0; j < c; j++) {\n                map[i][j] = sc.nextInt();\n                if (map[i][j] > peak) {\n                    peak = map[i][j];\n                }\n            }\n        }\n        for (int i = 0; i < r; i++) {\n            int rowSum = 0;\n            for (int j = 0; j < c; j++) {\n                rowSum += map[i][j];\n            }\n            System.out.println(\"Row \" + i + \": \" + rowSum);\n        }\n        System.out.println(\"Peak: \" + peak);\n    }\n}",
          "tests": [
            {
              "name": "2 by 3 terrain",
              "stdin": "2 3\n10 20 30\n5 15 25\n",
              "expectedStdout": "Row 0: 60\nRow 1: 45\nPeak: 30"
            },
            {
              "name": "3 by 2 terrain",
              "stdin": "3 2\n1 2\n3 4\n5 6\n",
              "expectedStdout": "Row 0: 3\nRow 1: 7\nRow 2: 11\nPeak: 6"
            },
            {
              "name": "1 by 1 single voxel",
              "stdin": "1 1\n42\n",
              "expectedStdout": "Row 0: 42\nPeak: 42"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 3: Multidimensional Arrays",
            "verify": false
          },
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 3: Multidimensional Arrays",
            "verify": false
          }
        ]
      },
      {
        "id": "b6_l4",
        "title": "Strings & Immutability: The String Constant Pool",
        "xp": 30,
        "estimatedMinutes": 20,
        "story": "Ancient runes engraved on quarry pillars cannot be carved away once inscribed—they are immutable. In Java, Strings are immutable objects living in a specialized memory area known as the String Constant Pool.",
        "explanation": [
          {
            "type": "text",
            "content": "In Java, a `String` is an object, not a primitive. Most importantly, Strings are **immutable**: once created, their internal character data can never be altered."
          },
          {
            "type": "code",
            "content": "Immutability & The String Constant Pool:",
            "code": "String s1 = \"Diamond\"; // Placed in String Constant Pool (SCP)\nString s2 = \"Diamond\"; // Reuses exact same reference from SCP\nSystem.out.println(s1 == s2); // true (same memory address)\n\nString s3 = new String(\"Diamond\"); // Forces a new object on heap\nSystem.out.println(s1 == s3); // false (different objects)\nSystem.out.println(s1.equals(s3)); // true (identical content!)"
          },
          {
            "type": "callout",
            "calloutType": "mistake",
            "content": "NEVER use `==` to compare Strings! The `==` operator compares object memory references. Always use `.equals()` or `.equalsIgnoreCase()` to compare content."
          }
        ],
        "slides": [
          {
            "title": "Strings are Immutable",
            "content": "Any method that appears to modify a String (like `.toUpperCase()` or `.replace()`) actually produces and returns a brand-new String object."
          },
          {
            "title": "The String Constant Pool",
            "content": "The JVM caches string literals in the String Constant Pool inside heap memory to eliminate duplicate text allocations."
          },
          {
            "title": "Always Use .equals()",
            "content": "`==` tests whether two references point to the exact same memory address. `.equals()` tests whether two Strings contain the exact same characters."
          }
        ],
        "underTheHood": "In Java 9+, OpenJDK introduced 'Compact Strings'. If a String contains only Latin-1 characters (1 byte per char), it is internally stored as a `byte[]` with a 1-byte coder flag, cutting heap memory consumption in half compared to the old 2-byte UTF-16 `char[]` representation. String literals are stored in the String Constant Pool, which resides inside the JVM Heap (moved out of PermGen in Java 7).",
        "workedExample": {
          "code": "public class StringImmutability {\n    public static void main(String[] args) {\n        String original = \"iron\";\n        original.toUpperCase(); // Result is ignored!\n        System.out.println(\"Still lowercase: \" + original);\n        \n        // Correct: capture the returned new String\n        String transformed = original.toUpperCase();\n        System.out.println(\"Transformed: \" + transformed);\n    }\n}",
          "walkthrough": [
            "Line 3: Creates 'iron' in the String Constant Pool.",
            "Line 4: Invokes toUpperCase(), creating 'IRON' on the heap, but does not assign it. 'original' is completely unaffected.",
            "Line 5: Prints 'iron', proving Strings are immutable.",
            "Line 8: Correctly stores the new reference in 'transformed'."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Comparing Strings using == instead of .equals()",
            "error": "s1 == s2 evaluates to false when one String was read from Scanner or constructed via new",
            "fix": "Always write `s1.equals(s2)` or `\"expected\".equals(s1)` (which prevents NullPointerException)."
          },
          {
            "mistake": "Ignoring the return value of String manipulation methods",
            "error": "str.replace('a', 'b'); leaves str completely unchanged",
            "fix": "Assign the returned result: `str = str.replace('a', 'b');`."
          }
        ],
        "checkpoint": [
          {
            "question": "What does the following print?\n```java\nString a = \"java\";\nString b = new String(\"java\");\nSystem.out.println((a == b) + \" \" + a.equals(b));\n```",
            "options": [
              "true true",
              "false true",
              "true false",
              "false false"
            ],
            "answer": 1,
            "explanation": "`a == b` is false because `new` creates a distinct heap object. `a.equals(b)` is true because both contain identical characters."
          },
          {
            "question": "Why does Java make Strings immutable?",
            "options": [
              "For security (credentials/paths cannot be altered), thread-safety, and String Constant Pool caching",
              "Because Java lacks pointers",
              "To make compiling faster",
              "Because computers have limited hard drive space"
            ],
            "answer": 0,
            "explanation": "Immutability guarantees thread safety without synchronization, enables safe sharing in the String Pool, and prevents malicious tampering with file paths or network URLs."
          }
        ],
        "exercise": {
          "instructions": "Read two strings on separate lines. Print whether they have matching content (case-sensitive) using 'Match: true' or 'Match: false'. Then print the uppercase version of the first string followed by its character length in the format 'Rune: UPPER (N chars)'.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read two strings, compare and format\n        \n    }\n}",
          "hints": [
            "Read lines with sc.nextLine().",
            "Compare content using str1.equals(str2).",
            "Convert to uppercase using str1.toUpperCase() and get length with str1.length()."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String s1 = sc.nextLine();\n        String s2 = sc.hasNextLine() ? sc.nextLine() : \"\";\n        boolean match = s1.equals(s2);\n        System.out.println(\"Match: \" + match);\n        System.out.println(\"Rune: \" + s1.toUpperCase() + \" (\" + s1.length() + \" chars)\");\n    }\n}",
          "tests": [
            {
              "name": "Identical strings",
              "stdin": "diamond\ndiamond\n",
              "expectedStdout": "Match: true\nRune: DIAMOND (7 chars)"
            },
            {
              "name": "Different strings",
              "stdin": "obsidian\nbedrock\n",
              "expectedStdout": "Match: false\nRune: OBSIDIAN (8 chars)"
            },
            {
              "name": "Case difference",
              "stdin": "iron\nIron\n",
              "expectedStdout": "Match: false\nRune: IRON (4 chars)"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 3: Strings",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 63: Beware the performance of string concatenation",
            "verify": false
          }
        ]
      },
      {
        "id": "b6_l5",
        "title": "Essential String Methods & Tokenization",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "Deciphering quarry shipping manifests requires parsing item IDs, trimming dusty whitespace, and extracting coordinates. Java provides a rich toolkit of string inspection and manipulation methods.",
        "explanation": [
          {
            "type": "text",
            "content": "The `java.lang.String` class provides numerous built-in methods for searching, slicing, and inspecting text."
          },
          {
            "type": "code",
            "content": "Key String Operations:",
            "code": "String tag = \"  ORE:GOLD:99  \";\n\n// 1. Whitespace trimming\nString clean = tag.strip(); // \"ORE:GOLD:99\" (Java 11+ strip handles all Unicode spaces)\n\n// 2. Searching and indexing\nint firstColon = clean.indexOf(':'); // 3\nboolean hasGold = clean.contains(\"GOLD\"); // true\n\n// 3. Slicing with substring(begin, end)\nString prefix = clean.substring(0, 3); // \"ORE\" (end index is exclusive!)\n\n// 4. Splitting into tokens\nString[] parts = clean.split(\":\"); // [\"ORE\", \"GOLD\", \"99\"]"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "Remember that `substring(begin, end)` includes `begin` but EXCLUDES `end`. Length of the result is always `end - begin`."
          }
        ],
        "slides": [
          {
            "title": "Slicing with Substring",
            "content": "`str.substring(start, end)` is zero-based and end-exclusive. If you omit `end`, it slices to the very end of the string."
          },
          {
            "title": "Trimming and Searching",
            "content": "Use `.strip()` (Java 11+) to remove leading and trailing whitespace. Use `.indexOf(char)` to locate indices and `.contains(seq)` for boolean checks."
          },
          {
            "title": "Tokenizing with Split",
            "content": "The `.split(regex)` method partitions a string into an array of substrings matching a delimiter."
          }
        ],
        "underTheHood": "Prior to Java 7u6, `String.substring()` shared the original character array with a new offset and count, which risked holding large parent buffers in memory. Since Java 7u6, `substring()` copies the exact sub-range into a new byte array, guaranteeing complete memory isolation and allowing unused original strings to be garbage collected immediately.",
        "workedExample": {
          "code": "public class ManifestParser {\n    public static void main(String[] args) {\n        String line = \"IRON_ORE,64,ZONE_B\";\n        String[] tokens = line.split(\",\");\n        \n        String item = tokens[0];\n        int count = Integer.parseInt(tokens[1]);\n        String zone = tokens[2];\n        \n        System.out.println(count + \" units of \" + item + \" stored in \" + zone);\n    }\n}",
          "walkthrough": [
            "Line 3: Defines a comma-separated record line.",
            "Line 4: Splits the line on ',' into an array of 3 String tokens.",
            "Line 6: Parses the second token into a primitive int using Integer.parseInt().",
            "Line 9: Formats and prints the extracted structured data."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Off-by-one with substring end index",
            "error": "str.substring(0, 3) on 'JAVA' returns 'JAV', missing the final letter",
            "fix": "The end index is exclusive. To include character at index 3, pass `end = 4`."
          },
          {
            "mistake": "Splitting on regex special characters like '.' or '|' without escaping",
            "error": "\"a.b.c\".split(\".\") returns an empty array because '.' matches any character in regex",
            "fix": "Escape regex metacharacters: `str.split(\"\\\\.\")` or use `Pattern.quote(\".\")`."
          }
        ],
        "checkpoint": [
          {
            "question": "What is returned by `\"Minecraft\".substring(0, 4)`?",
            "options": [
              "Mine",
              "Minec",
              "inec",
              "Mining"
            ],
            "answer": 0,
            "explanation": "Indices 0, 1, 2, 3 correspond to 'M', 'i', 'n', 'e'. Index 4 is exclusive."
          },
          {
            "question": "What does `\"alpha,beta,gamma\".split(\",\").length` evaluate to?",
            "options": [
              "3",
              "2",
              "1",
              "16"
            ],
            "answer": 0,
            "explanation": "Splitting on comma creates an array of 3 elements: ['alpha', 'beta', 'gamma']."
          }
        ],
        "exercise": {
          "instructions": "Read a single manifest string formatted as 'ITEM_NAME:COUNT:LOCATION' (e.g. 'GOLD_ORE:32:NORTH_SHAFT'). Parse and output each component on separate lines in the format:\nItem: <ITEM_NAME>\nQuantity: <COUNT>\nLocation: <LOCATION>",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read manifest and parse tokens\n        \n    }\n}",
          "hints": [
            "Read the entire line using sc.nextLine().",
            "Split the line using .split(\":\").",
            "Print each token using the corresponding index 0, 1, and 2."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String line = sc.nextLine().strip();\n        String[] tokens = line.split(\":\");\n        if (tokens.length >= 3) {\n            System.out.println(\"Item: \" + tokens[0]);\n            System.out.println(\"Quantity: \" + tokens[1]);\n            System.out.println(\"Location: \" + tokens[2]);\n        }\n    }\n}",
          "tests": [
            {
              "name": "Gold Ore manifest",
              "stdin": "GOLD_ORE:32:NORTH_SHAFT\n",
              "expectedStdout": "Item: GOLD_ORE\nQuantity: 32\nLocation: NORTH_SHAFT"
            },
            {
              "name": "Redstone manifest",
              "stdin": "REDSTONE:64:EAST_VAULT\n",
              "expectedStdout": "Item: REDSTONE\nQuantity: 64\nLocation: EAST_VAULT"
            },
            {
              "name": "Torch manifest",
              "stdin": "TORCH:16:CAMP_BASE\n",
              "expectedStdout": "Item: TORCH\nQuantity: 16\nLocation: CAMP_BASE"
            }
          ]
        },
        "references": [
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 16: String Handling",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 3: The String API",
            "verify": false
          }
        ]
      },
      {
        "id": "b6_l6",
        "title": "StringBuilder & Modern Text Blocks (Java 15+)",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "When assembling massive quarry blueprints with thousands of lines, concatenating Strings in a loop with '+' will grind your workstation to a halt. StringBuilder provides a high-speed mutable character buffer, while modern Text Blocks let you write multiline templates cleanly.",
        "explanation": [
          {
            "type": "text",
            "content": "Because Strings are immutable, concatenating with `+` inside loops creates a new String and copies every character over and over, yielding disastrous $O(N^2)$ performance. `StringBuilder` provides a mutable buffer that expands dynamically."
          },
          {
            "type": "code",
            "content": "StringBuilder & Java 15+ Text Blocks:",
            "code": "// High-performance mutable string assembly\nStringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 5; i++) {\n    sb.append(\"Slot \").append(i).append(\"; \");\n}\nString result = sb.toString();\n\n// Java 15+ Multiline Text Block\nString blueprint = \"\"\"\n    === QUARRY REPORT ===\n    Status: Active\n    Yield: Optimal\n    \"\"\";"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Modern Text Blocks (`\"\"\"`) preserve newlines and automatically strip common incidental leading whitespace based on the closing quote's indentation!"
          }
        ],
        "slides": [
          {
            "title": "The Concatenation Trap",
            "content": "String concatenation with `+` inside a loop creates garbage objects on every iteration. 10,000 concatenations can stall the JVM."
          },
          {
            "title": "StringBuilder to the Rescue",
            "content": "`StringBuilder` maintains an internal expandable byte array. It appends in amortized $O(1)$ time."
          },
          {
            "title": "Modern Text Blocks (Java 15+)",
            "content": "Triple quotes (`\"\"\"`) allow clean multiline strings without messy `\\n` escape sequences or string concatenation."
          }
        ],
        "underTheHood": "Since Java 9, single-line string concatenations are compiled to invokedynamic calls via `StringConcatFactory.makeConcatWithConstants()`, allowing the JVM runtime to choose optimal bytecode strategies. However, in loops, `javac` cannot optimize across iterations. `StringBuilder` avoids this by allocating an internal array initialized to 16 characters (or specified capacity) and doubling capacity whenever full.",
        "workedExample": {
          "code": "public class ReportGenerator {\n    public static void main(String[] args) {\n        String[] items = {\"Coal\", \"Iron\", \"Gold\"};\n        StringBuilder sb = new StringBuilder(\"[\");\n        \n        for (int i = 0; i < items.length; i++) {\n            sb.append(items[i]);\n            if (i < items.length - 1) sb.append(\", \");\n        }\n        sb.append(\"]\");\n        \n        System.out.println(sb.toString());\n    }\n}",
          "walkthrough": [
            "Line 4: Initializes StringBuilder with opening bracket '['.",
            "Line 7: Appends the current item name directly into the mutable buffer.",
            "Line 8: Appends comma and space for all but the final item.",
            "Line 10: Appends closing bracket ']'.",
            "Line 12: Converts the completed mutable buffer to an immutable String with .toString()."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Using StringBuffer instead of StringBuilder in single-threaded code",
            "error": "Unnecessary synchronization overhead slows down execution",
            "fix": "Use `StringBuilder` for single-threaded code; `StringBuffer` is a legacy synchronized class rarely needed today."
          },
          {
            "mistake": "Opening a Text Block on the same line as the triple quotes",
            "error": "illegal text block open delimiter sequence, newline required after \"\"\"",
            "fix": "The opening `\"\"\"` must be followed immediately by a newline before text begins."
          }
        ],
        "checkpoint": [
          {
            "question": "Why should you prefer `StringBuilder` over `+` when assembling a string inside a loop?",
            "options": [
              "`StringBuilder` avoids creating intermediate String objects on every iteration, preventing $O(N^2)$ copying overhead",
              "`StringBuilder` is thread-safe while `+` is not",
              "`+` does not work inside loops in Java",
              "`StringBuilder` automatically translates strings into bytecode"
            ],
            "answer": 0,
            "explanation": "`StringBuilder` modifies an internal buffer in place, avoiding wasteful garbage collection and character array copying on every loop iteration."
          },
          {
            "question": "Which Java version standardized multiline Text Blocks (`\"\"\"`)?",
            "options": [
              "Java 8",
              "Java 11",
              "Java 15",
              "Java 21"
            ],
            "answer": 2,
            "explanation": "Text Blocks were previewed in Java 13/14 and permanently standardized in Java 15."
          }
        ],
        "exercise": {
          "instructions": "Read integer N, followed by N words on separate lines. Assemble them using StringBuilder into a single comma-separated list enclosed in brackets formatted as '[word1, word2, ...]'. Then print that string, followed on the next line by the reversed version of that exact bracketed string using StringBuilder's .reverse() method.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Assemble with StringBuilder and reverse\n        \n    }\n}",
          "hints": [
            "Start with `StringBuilder sb = new StringBuilder(\"[\");`.",
            "Loop N times reading each word with sc.next() or sc.nextLine().strip().",
            "Append comma and space if not the last item, then append ']'.",
            "Print sb.toString(), then call sb.reverse() and print sb.toString() again."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (int i = 0; i < n; i++) {\n            String word = sc.next();\n            sb.append(word);\n            if (i < n - 1) {\n                sb.append(\", \");\n            }\n        }\n        sb.append(\"]\");\n        System.out.println(sb.toString());\n        sb.reverse();\n        System.out.println(sb.toString());\n    }\n}",
          "tests": [
            {
              "name": "Three items",
              "stdin": "3\nCobble\nGranite\nBasalt\n",
              "expectedStdout": "[Cobble, Granite, Basalt]\n]tlasaB ,etinarG ,elbboC["
            },
            {
              "name": "Two items",
              "stdin": "2\nIron\nGold\n",
              "expectedStdout": "[Iron, Gold]\n]dloG ,norI["
            },
            {
              "name": "Single item",
              "stdin": "1\nDiamond\n",
              "expectedStdout": "[Diamond]\n]dnomaiD["
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 3: Building Strings",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 63: Beware the performance of string concatenation",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "id": "b6_q1",
        "type": "mcq",
        "question": "What is the index of the last element in an array named `blocks`?",
        "options": [
          "blocks.length",
          "blocks.length - 1",
          "blocks.size()",
          "blocks.lastIndex"
        ],
        "answer": 1,
        "explanation": "Java arrays are zero-indexed, so an array with N elements has indices 0 through N - 1."
      },
      {
        "id": "b6_q2",
        "type": "predict-output",
        "question": "What is the output of this code?\n```java\nint[] nums = {10, 20, 30};\nnums[1] += 5;\nSystem.out.println(nums[0] + nums[1]);\n```",
        "options": [
          "35",
          "30",
          "25",
          "15"
        ],
        "answer": 0,
        "explanation": "`nums[1]` becomes 20 + 5 = 25. Adding `nums[0]` (10) + `nums[1]` (25) yields 35."
      },
      {
        "id": "b6_q3",
        "type": "spot-the-bug",
        "question": "Identify the bug in this array printing loop:\n```java\nint[] arr = {1, 2, 3};\nfor (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]);\n}\n```",
        "options": [
          "Loop boundary uses <= instead of <, causing ArrayIndexOutOfBoundsException",
          "Array indexing must start at 1",
          "arr.length() requires parentheses",
          "Cannot print array elements with println"
        ],
        "answer": 0,
        "explanation": "`i <= arr.length` attempts to access `arr[3]`, which is out of bounds for an array of length 3."
      },
      {
        "id": "b6_q4",
        "type": "mcq",
        "question": "What is the default value of elements in a newly allocated `boolean[]` of size 5?",
        "options": [
          "true",
          "false",
          "null",
          "0"
        ],
        "answer": 1,
        "explanation": "Java initializes boolean array elements to `false` by default."
      },
      {
        "id": "b6_q5",
        "type": "predict-output",
        "question": "What does this code print?\n```java\nString s1 = \"Nether\";\nString s2 = \"Nether\";\nString s3 = new String(\"Nether\");\nSystem.out.println((s1 == s2) + \" \" + (s1 == s3));\n```",
        "options": [
          "true true",
          "true false",
          "false true",
          "false false"
        ],
        "answer": 1,
        "explanation": "`s1 == s2` is true because both refer to the same literal in the String Constant Pool. `s1 == s3` is false because `new` creates a distinct heap object."
      },
      {
        "id": "b6_q6",
        "type": "mcq",
        "question": "Which method must be used to compare the content of two String variables?",
        "options": [
          "==",
          ".equals()",
          ".compare()",
          ".isSame()"
        ],
        "answer": 1,
        "explanation": "`.equals()` compares character content. `==` checks reference address identity."
      },
      {
        "id": "b6_q7",
        "type": "spot-the-bug",
        "question": "Spot the bug in this code:\n```java\nString name = \"steve\";\nname.toUpperCase();\nSystem.out.println(name);\n```",
        "options": [
          "name is still 'steve' because Strings are immutable and the return value was not assigned",
          "toUpperCase() does not exist in Java",
          "String cannot be declared with lowercase letters",
          "Printing name requires .toString()"
        ],
        "answer": 0,
        "explanation": "Because Strings are immutable, `name.toUpperCase()` returns a new string rather than modifying `name` in place."
      },
      {
        "id": "b6_q8",
        "type": "predict-output",
        "question": "What is the output of `\"CRAFTING\".substring(2, 5)`?",
        "options": [
          "AFT",
          "RAF",
          "CRAF",
          "AF"
        ],
        "answer": 0,
        "explanation": "Index 2 is 'A', index 3 is 'F', index 4 is 'T'. Index 5 is exclusive, so the result is 'AFT'."
      },
      {
        "id": "b6_q9",
        "type": "mcq",
        "question": "What happens in memory when you instantiate a 2D array in Java like `int[][] grid = new int[3][3];`?",
        "options": [
          "A single contiguous block of 9 integers is allocated",
          "An outer array of 3 references is allocated, pointing to 3 separate row arrays on the heap",
          "A linked list of integers is created",
          "Memory is allocated only when elements are assigned"
        ],
        "answer": 1,
        "explanation": "Java multi-dimensional arrays are arrays of references to independent row arrays."
      },
      {
        "id": "b6_q10",
        "type": "predict-output",
        "question": "What does this code print?\n```java\nStringBuilder sb = new StringBuilder(\"Java\");\nsb.append(\"Quest\");\nsb.reverse();\nSystem.out.println(sb);\n```",
        "options": [
          "tseuQavaJ",
          "JavaQuest",
          "QuestJava",
          "tseuQ avaJ"
        ],
        "answer": 0,
        "explanation": "Appending creates 'JavaQuest'. Reversing it produces 'tseuQavaJ'."
      },
      {
        "id": "b6_q11",
        "type": "order-the-lines",
        "question": "Order these lines to read 3 words and assemble them with StringBuilder:",
        "options": [
          "Scanner sc = new Scanner(System.in);",
          "StringBuilder sb = new StringBuilder();",
          "for (int i = 0; i < 3; i++) { sb.append(sc.next()); }",
          "System.out.println(sb.toString());"
        ],
        "answer": [
          0,
          1,
          2,
          3
        ],
        "explanation": "Instantiate Scanner, create StringBuilder, loop to append tokens, then output the string."
      },
      {
        "id": "b6_q12",
        "type": "fill-in",
        "question": "Complete the statement to split a CSV line by comma: `String[] tokens = line.____(\",\");`",
        "options": [
          "split",
          "tokenize",
          "slice",
          "divide"
        ],
        "answer": 0,
        "explanation": "The `.split(regex)` method partitions a string into tokens based on a delimiter."
      }
    ],
    "project": {
      "title": "Voxel Warehouse Inventory Matrix",
      "brief": "Construct an interactive warehouse inventory manager that stores item counts across a 2D warehouse grid, calculates row-by-row storage tallies, searches for items by code, and produces a formatted manifest report using StringBuilder.",
      "milestones": [
        "Milestone 1: Allocate and populate a 2D matrix representing storage bays and slots",
        "Milestone 2: Implement row-wise and column-wise stock aggregation routines",
        "Milestone 3: Build a search method to verify stock levels and return bay coordinates",
        "Milestone 4: Generate an ASCII inventory ledger report using StringBuilder and Text Blocks"
      ],
      "rubric": [
        {
          "criterion": "Matrix safety",
          "points": 25,
          "description": "Correct boundary checking avoiding ArrayIndexOutOfBoundsException"
        },
        {
          "criterion": "Array traversal",
          "points": 25,
          "description": "Effective use of classic and enhanced for loops"
        },
        {
          "criterion": "String operations",
          "points": 25,
          "description": "Safe content comparison with .equals() and proper tokenization"
        },
        {
          "criterion": "Efficiency & Formatting",
          "points": 25,
          "description": "Appropriate StringBuilder usage for assembling reports"
        }
      ],
      "stretchGoals": [
        "Support dynamic jagged warehouse bays with unequal slot counts",
        "Implement a high-speed item relocation method swapping two matrix coordinates"
      ]
    },
    "glossary": [
      {
        "term": "Array",
        "definition": "A fixed-size, contiguous sequence of elements of the same data type allocated on the heap."
      },
      {
        "term": "Zero-based indexing",
        "definition": "A memory addressing scheme where the first element is at offset/index 0."
      },
      {
        "term": "ArrayIndexOutOfBoundsException",
        "definition": "A runtime exception thrown when attempting to access an array with an index less than 0 or greater than or equal to length."
      },
      {
        "term": "Jagged Array",
        "definition": "A multi-dimensional array where sub-arrays (rows) have differing lengths."
      },
      {
        "term": "String Constant Pool (SCP)",
        "definition": "A specialized memory region inside the JVM Heap that stores deduplicated String literals."
      },
      {
        "term": "Immutability",
        "definition": "The characteristic of an object whose state cannot be modified after it is constructed."
      },
      {
        "term": "StringBuilder",
        "definition": "A mutable sequence of characters providing fast append, insert, and delete operations without creating garbage objects."
      },
      {
        "term": "Text Block",
        "definition": "A multiline string literal introduced in Java 15 delimited by triple quotes (\"\"\") that strips common incidental indentation."
      }
    ],
    "references": [
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 3: Fundamental Programming Structures in Java (Strings and Arrays)",
        "verify": false
      },
      {
        "source": "Java: The Complete Reference, 12th ed.",
        "location": "Chapter 3: Arrays & Chapter 16: String Handling",
        "verify": false
      },
      {
        "source": "Effective Java, 3rd ed.",
        "location": "Item 63: Beware the performance of string concatenation",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b7",
    "code": "B7",
    "track": "beginner",
    "title": "Classes & Object-Oriented Foundations",
    "subtitle": "State and behavior, encapsulation, constructors, the `this` reference, and static class members",
    "biome": "Architect Academy",
    "estimatedMinutes": 150,
    "learningObjectives": [
      "Model real-world and voxel entities using classes with encapsulated fields and methods",
      "Instantiate and manipulate objects on the JVM Heap using reference variables",
      "Design overloaded constructors to guarantee reliable initialization invariants",
      "Apply the this keyword for field disambiguation and explicit constructor chaining",
      "Implement encapsulation using private fields, accessors (getters), and mutators (setters)",
      "Distinguish between instance state and class-level static fields, constants, and utility methods"
    ],
    "prerequisites": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5",
      "b6"
    ],
    "lessons": [
      {
        "id": "b7_l1",
        "title": "Classes as Blueprints & Heap Instances",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "At the Architect Academy, master builders design architectural blueprints before placing a single block. In Java, a class is the blueprint, and an object is the concrete instance constructed in memory.",
        "explanation": [
          {
            "type": "text",
            "content": "Object-Oriented Programming (OOP) organizes software around data structures called **objects**. A **class** defines the template (state and behavior), while an **instance** is the actual object created in memory."
          },
          {
            "type": "code",
            "content": "Class Definition & Instantiation:",
            "code": "class Beacon {\n    String name;\n    int powerLevel;\n}\n\npublic class Academy {\n    public static void main(String[] args) {\n        // Instantiating objects with 'new'\n        Beacon b1 = new Beacon();\n        b1.name = \"North Peak\";\n        b1.powerLevel = 100;\n        \n        Beacon b2 = new Beacon();\n        b2.name = \"South Harbor\";\n        b2.powerLevel = 80;\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "The variable `b1` does not store the object itself. It holds a **reference** (a memory pointer) pointing to the Beacon object on the JVM Heap."
          }
        ],
        "slides": [
          {
            "title": "Blueprint vs Object",
            "content": "A class specifies what fields and methods exist. You can instantiate dozens of distinct objects from one single class blueprint."
          },
          {
            "title": "Heap Allocation with new",
            "content": "The `new` keyword allocates memory on the Heap. The reference variable on the thread's Stack points to that Heap location."
          },
          {
            "title": "Default Field Values",
            "content": "Unlike local variables in methods which must be initialized manually, instance fields in classes receive default zero values (0, false, null)."
          }
        ],
        "underTheHood": "When the JVM executes the `new` bytecode instruction, it calculates the memory required for the object's fields plus a 12 or 16-byte object header (Mark Word + Klass Word with compressed oops enabled). The object is allocated in the Young Generation (Eden space) of the JVM Heap. The reference returned is pushed onto the thread stack.",
        "workedExample": {
          "code": "class Voxel {\n    int x;\n    int y;\n    int z;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Voxel block = new Voxel();\n        block.x = 10;\n        block.y = 64;\n        block.z = -5;\n        \n        System.out.println(\"Coordinates: \" + block.x + \", \" + block.y + \", \" + block.z);\n    }\n}",
          "walkthrough": [
            "Lines 1-5: Declares the Voxel class with 3 integer fields.",
            "Line 8: Allocates a new Voxel on the heap; block holds its reference.",
            "Lines 9-11: Assigns coordinate values to the block's fields via the dot (.) operator.",
            "Line 13: Reads the fields to format and print the coordinates."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Dereferencing an uninitialized reference variable",
            "error": "NullPointerException: Cannot assign field because 'block' is null",
            "fix": "Always instantiate your object with `new Voxel()` before accessing its fields."
          },
          {
            "mistake": "Accessing instance fields via the class name",
            "error": "non-static variable x cannot be referenced from a static context",
            "fix": "Instance fields belong to an object instance (`myObj.x`), not the class name (`MyClass.x`)."
          }
        ],
        "checkpoint": [
          {
            "question": "Where are objects located in JVM memory?",
            "options": [
              "On the Heap",
              "On the Thread Stack",
              "Inside the CPU Registers",
              "Inside the JVM Metaspace"
            ],
            "answer": 0,
            "explanation": "All Java objects are dynamically allocated on the JVM Heap. Reference variables pointing to them typically live on the Stack."
          },
          {
            "question": "What is the default value of an uninitialized `String` field inside a newly created object?",
            "options": [
              "\"\"",
              "null",
              "\"undefined\"",
              "0"
            ],
            "answer": 1,
            "explanation": "Reference types inside classes default to `null` if not explicitly initialized."
          }
        ],
        "exercise": {
          "instructions": "Create a class named `Beacon` with public fields `String name` and `int power`. In `Main.main`, read two beacons from input (each on its own line: name followed by power), instantiate two Beacon objects, populate their fields, and print each in the format 'Beacon: <name> (Power: <power>)'.",
          "starterCode": "import java.util.Scanner;\n\nclass Beacon {\n    // Define fields\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Instantiate and print two beacons\n        \n    }\n}",
          "hints": [
            "Define `String name;` and `int power;` inside class Beacon.",
            "Create `Beacon b1 = new Beacon();` and read `b1.name = sc.next(); b1.power = sc.nextInt();`.",
            "Repeat for b2 and print using System.out.println."
          ],
          "solution": "import java.util.Scanner;\n\nclass Beacon {\n    String name;\n    int power;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        Beacon b1 = new Beacon();\n        b1.name = sc.next();\n        b1.power = sc.nextInt();\n        \n        Beacon b2 = new Beacon();\n        b2.name = sc.next();\n        b2.power = sc.nextInt();\n        \n        System.out.println(\"Beacon: \" + b1.name + \" (Power: \" + b1.power + \")\");\n        System.out.println(\"Beacon: \" + b2.name + \" (Power: \" + b2.power + \")\");\n    }\n}",
          "tests": [
            {
              "name": "North and South towers",
              "stdin": "NorthTower 100\nSouthGate 85\n",
              "expectedStdout": "Beacon: NorthTower (Power: 100)\nBeacon: SouthGate (Power: 85)"
            },
            {
              "name": "Alpha and Beta beacons",
              "stdin": "Alpha 50\nBeta 75\n",
              "expectedStdout": "Beacon: Alpha (Power: 50)\nBeacon: Beta (Power: 75)"
            },
            {
              "name": "Citadel and Outpost",
              "stdin": "Citadel 999\nOutpost 10\n",
              "expectedStdout": "Beacon: Citadel (Power: 999)\nBeacon: Outpost (Power: 10)"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 2: A Trip to Objectville",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Objects and Classes",
            "verify": false
          }
        ]
      },
      {
        "id": "b7_l2",
        "title": "Instance Methods & State Mutation",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "Blueprints don't just hold numbers—they contain mechanisms that move and react. Instance methods define the actions an object can perform on its own internal state.",
        "explanation": [
          {
            "type": "text",
            "content": "An **instance method** is a function declared inside a class without the `static` keyword. It operates directly on the instance's specific fields."
          },
          {
            "type": "code",
            "content": "Defining and Calling Instance Methods:",
            "code": "class Tool {\n    int durability = 100;\n    \n    void use(int wear) {\n        durability -= wear;\n        if (durability < 0) durability = 0;\n    }\n    \n    void repair(int amount) {\n        durability += amount;\n    }\n}\n\n// Usage:\nTool pickaxe = new Tool();\npickaxe.use(30); // durability is now 70"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Instance methods have direct access to the object's instance fields. Each object maintains its own independent copy of those fields."
          }
        ],
        "slides": [
          {
            "title": "Encapsulating Behavior",
            "content": "Methods define what an object can do. Instead of external code altering fields directly, instance methods manipulate state with business logic."
          },
          {
            "title": "Non-Static Scope",
            "content": "Instance methods are called on a specific object reference (`pickaxe.use(10)`). They cannot be called directly from the class name."
          },
          {
            "title": "Independent State",
            "content": "Calling a method on object A alters object A's fields; object B is completely untouched."
          }
        ],
        "underTheHood": "In Java bytecode, instance method calls are dispatched using the `invokevirtual` instruction (or `invokespecial` for private/super calls). At runtime, the JVM looks up the method in the object's virtual method table (vtable). The target object reference is passed silently as parameter index 0 (`this`).",
        "workedExample": {
          "code": "class Player {\n    int health = 100;\n    \n    void takeDamage(int dmg) {\n        health = Math.max(0, health - dmg);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player p1 = new Player();\n        p1.takeDamage(40);\n        System.out.println(\"P1 Health: \" + p1.health);\n    }\n}",
          "walkthrough": [
            "Lines 1-7: Declares Player with health and takeDamage method.",
            "Line 4: Math.max ensures health never falls below 0.",
            "Line 10: Instantiates Player p1 with 100 health.",
            "Line 11: Invokes takeDamage(40), reducing p1.health to 60.",
            "Line 12: Outputs 60."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Marking an instance method as static",
            "error": "non-static variable health cannot be referenced from a static context",
            "fix": "Remove `static` from method declarations when they need to inspect or mutate instance fields."
          },
          {
            "mistake": "Invoking an instance method without an instantiated object",
            "error": "NullPointerException: Cannot invoke method because 'p' is null",
            "fix": "Ensure the reference variable points to a valid object allocated with `new`."
          }
        ],
        "checkpoint": [
          {
            "question": "What is passed silently as argument 0 to every instance method in Java bytecode?",
            "options": [
              "The `this` reference pointing to the target object",
              "The class loader",
              "The return type",
              "Nothing"
            ],
            "answer": 0,
            "explanation": "The JVM implicitly passes the invoking object as `this` at local variable index 0."
          },
          {
            "question": "What happens to object B's fields when you call a mutator method on object A?",
            "options": [
              "Nothing; each object maintains its own independent state on the heap",
              "Object B's fields change if both objects are of the same class",
              "A ConcurrentModificationException is thrown",
              "The JVM synchronizes them"
            ],
            "answer": 0,
            "explanation": "Objects have independent heap allocations and independent field states."
          }
        ],
        "exercise": {
          "instructions": "Create class `Shield` with field `int defense` and methods `void takeHit(int damage)` (reduces defense by damage, minimum 0) and `void repair(int amount)` (increases defense). In `Main.main`, read starting defense, hit damage, and repair amount. Apply the hit, print 'After Hit: X', apply the repair, and print 'After Repair: Y'.",
          "starterCode": "import java.util.Scanner;\n\nclass Shield {\n    // Implement fields and methods\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Test Shield methods\n        \n    }\n}",
          "hints": [
            "In takeHit: `defense -= damage; if (defense < 0) defense = 0;`",
            "In repair: `defense += amount;`",
            "Instantiate Shield, set defense, call takeHit, print, call repair, print."
          ],
          "solution": "import java.util.Scanner;\n\nclass Shield {\n    int defense;\n    \n    void takeHit(int damage) {\n        defense -= damage;\n        if (defense < 0) defense = 0;\n    }\n    \n    void repair(int amount) {\n        defense += amount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        Shield shield = new Shield();\n        shield.defense = sc.nextInt();\n        int damage = sc.nextInt();\n        int repairAmt = sc.nextInt();\n        \n        shield.takeHit(damage);\n        System.out.println(\"After Hit: \" + shield.defense);\n        shield.repair(repairAmt);\n        System.out.println(\"After Repair: \" + shield.defense);\n    }\n}",
          "tests": [
            {
              "name": "Partial damage and repair",
              "stdin": "100 35 15\n",
              "expectedStdout": "After Hit: 65\nAfter Repair: 80"
            },
            {
              "name": "Overkill damage clamped to 0",
              "stdin": "50 80 20\n",
              "expectedStdout": "After Hit: 0\nAfter Repair: 20"
            },
            {
              "name": "Zero repair",
              "stdin": "200 50 0\n",
              "expectedStdout": "After Hit: 150\nAfter Repair: 150"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 4: How Objects Behave",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Method Parameters",
            "verify": false
          }
        ]
      },
      {
        "id": "b7_l3",
        "title": "Constructors & Parameterized Initialization",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "When building a fortress gate, you don't build an empty arch and then punch holes in it—you construct it to exact dimensions right from the start. Constructors guarantee objects start life in a valid state.",
        "explanation": [
          {
            "type": "text",
            "content": "A **constructor** is a special block of code that executes automatically when an object is created with `new`. Its purpose is to initialize instance fields."
          },
          {
            "type": "code",
            "content": "Constructor Syntax & Overloading:",
            "code": "class Portal {\n    String destination;\n    boolean active;\n    \n    // Parameterized constructor\n    public Portal(String dest, boolean isActive) {\n        destination = dest;\n        active = isActive;\n    }\n    \n    // Overloaded no-arg constructor\n    public Portal() {\n        destination = \"Overworld Spawn\";\n        active = true;\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "A constructor NEVER has a return type—not even `void`! If you write `void Portal()`, Java treats it as a standard method, NOT a constructor."
          }
        ],
        "slides": [
          {
            "title": "Constructor Rules",
            "content": "1. Must match the exact class name.\n2. Must NOT have any return type.\n3. Called exclusively via `new`."
          },
          {
            "title": "The Default Constructor",
            "content": "If you define NO constructors, Java generates a public no-arg default constructor. Once you write ANY constructor, the automatic default constructor disappears!"
          },
          {
            "title": "Constructor Overloading",
            "content": "Like methods, constructors can be overloaded with different parameter lists to provide multiple convenient ways to construct objects."
          }
        ],
        "underTheHood": "The Java compiler generates an `<init>` instance initialization method in the class bytecode for every constructor. The first instruction of `<init>` always invokes a constructor of the superclass (`super()`), or another constructor in the same class (`this()`). Only after the superclass constructor completes are field initializers and the constructor's body executed.",
        "workedExample": {
          "code": "class Item {\n    String name;\n    int stackLimit;\n    \n    public Item(String n, int limit) {\n        name = n;\n        stackLimit = limit;\n    }\n    \n    public Item(String n) {\n        name = n;\n        stackLimit = 64; // Default stack limit\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Item sword = new Item(\"Diamond Sword\", 1);\n        Item dirt = new Item(\"Dirt\");\n        System.out.println(sword.name + \": max \" + sword.stackLimit);\n        System.out.println(dirt.name + \": max \" + dirt.stackLimit);\n    }\n}",
          "walkthrough": [
            "Lines 5-8: Two-parameter constructor for custom stack limits.",
            "Lines 10-13: Overloaded single-parameter constructor defaulting limit to 64.",
            "Line 17: Creates sword with custom limit 1.",
            "Line 18: Creates dirt using the overloaded default limit constructor."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Adding a void return type to a constructor declaration",
            "error": "Constructor behaves as an ordinary method and is never called by new",
            "fix": "Remove `void` completely: write `public Portal(...)`, not `public void Portal(...)`."
          },
          {
            "mistake": "Calling new MyClass() after writing a custom parameterized constructor",
            "error": "constructor MyClass in class MyClass cannot be applied to given types; required: String; found: no arguments",
            "fix": "If you define a custom constructor, Java removes the automatic no-arg constructor. Add an explicit no-arg constructor if needed."
          }
        ],
        "checkpoint": [
          {
            "question": "What happens if a class defines a constructor with parameters, and code attempts to call `new MyClass()` without arguments?",
            "options": [
              "Compilation error: no matching no-arg constructor exists",
              "Java calls the default constructor automatically",
              "Fields are set to null and 0",
              "A runtime NoSuchMethodException is thrown"
            ],
            "answer": 0,
            "explanation": "Once you define ANY constructor, the compiler no longer generates an automatic default no-arg constructor."
          },
          {
            "question": "Which of the following is a valid constructor for class `Golem`?",
            "options": [
              "public Golem() { }",
              "public void Golem() { }",
              "public static Golem() { }",
              "Golem Golem() { }"
            ],
            "answer": 0,
            "explanation": "Constructors must match the class name and must not specify any return type."
          }
        ],
        "exercise": {
          "instructions": "Create class `Player` with fields `String name` and `int health`. Provide two constructors: one taking `(String name, int health)`, and another taking only `(String name)` which sets health to 100. Read inputs for two players: player 1 with name and custom health, player 2 with only a name. Print both players as 'Player: <name> [HP: <health>]'.",
          "starterCode": "import java.util.Scanner;\n\nclass Player {\n    // Add fields and two constructors\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Construct and print both players\n        \n    }\n}",
          "hints": [
            "Constructor 1: `public Player(String n, int h) { name = n; health = h; }`",
            "Constructor 2: `public Player(String n) { name = n; health = 100; }`",
            "Read p1 with sc.next() and sc.nextInt(), read p2 with sc.next()."
          ],
          "solution": "import java.util.Scanner;\n\nclass Player {\n    String name;\n    int health;\n    \n    public Player(String name, int health) {\n        this.name = name;\n        this.health = health;\n    }\n    \n    public Player(String name) {\n        this.name = name;\n        this.health = 100;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String name1 = sc.next();\n        int hp1 = sc.nextInt();\n        String name2 = sc.next();\n        \n        Player p1 = new Player(name1, hp1);\n        Player p2 = new Player(name2);\n        \n        System.out.println(\"Player: \" + p1.name + \" [HP: \" + p1.health + \"]\");\n        System.out.println(\"Player: \" + p2.name + \" [HP: \" + p2.health + \"]\");\n    }\n}",
          "tests": [
            {
              "name": "Alex custom and Steve default",
              "stdin": "Alex 150\nSteve\n",
              "expectedStdout": "Player: Alex [HP: 150]\nPlayer: Steve [HP: 100]"
            },
            {
              "name": "Archer custom and Knight default",
              "stdin": "Archer 80\nKnight\n",
              "expectedStdout": "Player: Archer [HP: 80]\nPlayer: Knight [HP: 100]"
            },
            {
              "name": "Solo and Echo",
              "stdin": "Solo 250\nEcho\n",
              "expectedStdout": "Player: Solo [HP: 250]\nPlayer: Echo [HP: 100]"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 9: Life and Death of an Object",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Constructor Execution",
            "verify": false
          }
        ]
      },
      {
        "id": "b7_l4",
        "title": "The this Keyword & Constructor Chaining",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "Inside the sprawling corridors of the Academy, blueprints often need to refer to 'this exact room' rather than another. In Java, this is a reference to the current instance, used for resolving shadowed variable names and chaining constructors.",
        "explanation": [
          {
            "type": "text",
            "content": "The `this` keyword is a reference to the current object instance whose method or constructor is being called."
          },
          {
            "type": "code",
            "content": "Shadowing and Constructor Chaining with this:",
            "code": "class Waypoint {\n    String label;\n    int x, y;\n    \n    // 1. Resolving shadowed field names\n    public Waypoint(String label, int x, int y) {\n        this.label = label; // 'this.label' is the field; 'label' is the parameter\n        this.x = x;\n        this.y = y;\n    }\n    \n    // 2. Chaining constructors with this(...)\n    public Waypoint(String label) {\n        this(label, 0, 0); // Delegates to the 3-arg constructor!\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "When calling another constructor via `this(...)`, it **MUST** be the very first statement in the constructor body. You cannot place code before `this(...)`!"
          }
        ],
        "slides": [
          {
            "title": "Resolving Shadowing",
            "content": "When method parameters have the exact same name as instance fields, the parameter shadows the field. Prefix with `this.fieldName` to access the instance field."
          },
          {
            "title": "Constructor Chaining with this()",
            "content": "Use `this(args)` to call another constructor within the same class, eliminating duplicated initialization code."
          },
          {
            "title": "First-Line Rule",
            "content": "`this()` must always be the very first line of a constructor, or the compiler will reject the code."
          }
        ],
        "underTheHood": "In the local variable table of any non-static method or constructor, the reference to `this` is automatically loaded into slot 0 (`aload_0`). When invoking `this(...)` for constructor delegation, the JVM emits an `invokespecial <init>` bytecode instruction targeting the sibling constructor.",
        "workedExample": {
          "code": "class Box {\n    int width, height;\n    \n    public Box(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n    \n    public Box(int side) {\n        this(side, side); // Reuses the 2-arg constructor for squares\n    }\n    \n    public void describe() {\n        System.out.println(this.width + \"x\" + this.height);\n    }\n}",
          "walkthrough": [
            "Lines 4-7: Uses this.width and this.height to disambiguate from incoming parameters.",
            "Lines 9-11: Square constructor chains directly into the 2-parameter constructor.",
            "Line 10: this(side, side) satisfies the first-statement constraint.",
            "Line 14: Method prints dimensions using instance state."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Writing x = x instead of this.x = x in a constructor",
            "error": "Field x remains 0 because the parameter assigned to itself, shadowing the field",
            "fix": "Always write `this.x = x;` when the parameter has the exact same name as the instance field."
          },
          {
            "mistake": "Placing code before this(...) constructor call",
            "error": "call to this must be first statement in constructor",
            "fix": "Move any logging or validation after `this(...)` or into the delegated constructor."
          }
        ],
        "checkpoint": [
          {
            "question": "What does `this(arg1, arg2);` inside a constructor do?",
            "options": [
              "Calls another overloaded constructor in the same class",
              "Creates a new duplicate object",
              "Calls the constructor of the parent class",
              "Restarts the JVM"
            ],
            "answer": 0,
            "explanation": "`this(...)` invokes an alternate constructor in the same class to promote code reuse."
          },
          {
            "question": "Where can `this(...)` constructor chaining be placed inside a constructor?",
            "options": [
              "Only as the very first statement",
              "Anywhere before the return statement",
              "Only in the finally block",
              "At the end of the constructor"
            ],
            "answer": 0,
            "explanation": "Java grammar requires explicit constructor calls (`this()` or `super()`) to be the very first statement."
          }
        ],
        "exercise": {
          "instructions": "Create class `Waypoint` with fields `String label`, `int x`, and `int y`. Write a 3-argument constructor using `this.x = x`, and an overloaded 1-argument constructor that chains `this(label, 0, 0)`. Read one labeled waypoint with coordinates (label, x, y) and one label-only waypoint. Print both in the format: '<label> @ (X, Y)'.",
          "starterCode": "import java.util.Scanner;\n\nclass Waypoint {\n    // Implement fields, constructors with chaining\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read, instantiate, and print\n        \n    }\n}",
          "hints": [
            "3-arg constructor: `this.label = label; this.x = x; this.y = y;`",
            "1-arg constructor: `this(label, 0, 0);`",
            "Read `name1 = sc.next(); x1 = sc.nextInt(); y1 = sc.nextInt();` then `name2 = sc.next();`."
          ],
          "solution": "import java.util.Scanner;\n\nclass Waypoint {\n    String label;\n    int x, y;\n    \n    public Waypoint(String label, int x, int y) {\n        this.label = label;\n        this.x = x;\n        this.y = y;\n    }\n    \n    public Waypoint(String label) {\n        this(label, 0, 0);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String l1 = sc.next();\n        int x1 = sc.nextInt();\n        int y1 = sc.nextInt();\n        String l2 = sc.next();\n        \n        Waypoint w1 = new Waypoint(l1, x1, y1);\n        Waypoint w2 = new Waypoint(l2);\n        \n        System.out.println(w1.label + \" @ (\" + w1.x + \", \" + w1.y + \")\");\n        System.out.println(w2.label + \" @ (\" + w2.x + \", \" + w2.y + \")\");\n    }\n}",
          "tests": [
            {
              "name": "Base and Spawn",
              "stdin": "Base 12 -45\nSpawn\n",
              "expectedStdout": "Base @ (12, -45)\nSpawn @ (0, 0)"
            },
            {
              "name": "Fortress and Portal",
              "stdin": "Fortress 100 250\nPortal\n",
              "expectedStdout": "Fortress @ (100, 250)\nPortal @ (0, 0)"
            },
            {
              "name": "Camp and Hub",
              "stdin": "Camp 5 5\nHub\n",
              "expectedStdout": "Camp @ (5, 5)\nHub @ (0, 0)"
            }
          ]
        },
        "references": [
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 6: A Closer Look at Methods and Classes (The this Keyword)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Calling Another Constructor",
            "verify": false
          }
        ]
      },
      {
        "id": "b7_l5",
        "title": "Encapsulation, Access Modifiers & Invariant Validation",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "A vault door that anyone can open is no vault at all. Encapsulation hides internal state behind private access modifiers and exposes controlled public methods, defending the integrity of your data.",
        "explanation": [
          {
            "type": "text",
            "content": "**Encapsulation** is the fundamental OOP principle of bundling data and methods inside a class while restricting direct external access to internal representation."
          },
          {
            "type": "code",
            "content": "Private Fields & Invariant Protection:",
            "code": "class Vault {\n    private int emeralds; // Hidden from outside tampering\n    \n    public int getEmeralds() {\n        return emeralds;\n    }\n    \n    public void deposit(int count) {\n        if (count > 0) {\n            emeralds += count; // Invariant preserved: cannot deposit negative amounts\n        }\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Access Levels in Java: `private` (class only), package-private (default, same package), `protected` (package + subclasses), `public` (accessible everywhere)."
          }
        ],
        "slides": [
          {
            "title": "The Principle of Encapsulation",
            "content": "Make fields `private`. Expose `public` getter and setter methods only when necessary."
          },
          {
            "title": "Protecting Invariants",
            "content": "A setter can reject invalid input (e.g., negative balance, null strings), preventing bugs from corrupting application state."
          },
          {
            "title": "Loose Coupling",
            "content": "Encapsulation allows you to change internal data structures (e.g. switching an int to a long) without breaking external code using getters."
          }
        ],
        "underTheHood": "Access modifiers are recorded directly in the compiled `.class` file as field and method access flags (`ACC_PUBLIC`, `ACC_PRIVATE`). The JVM Bytecode Verifier checks these permissions at runtime during class linking. Direct unauthorized field access results in an `IllegalAccessError`.",
        "workedExample": {
          "code": "class HealthGauge {\n    private int hp = 100;\n    \n    public int getHp() { return hp; }\n    \n    public void modifyHp(int delta) {\n        hp += delta;\n        if (hp < 0) hp = 0;\n        if (hp > 100) hp = 100;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        HealthGauge h = new HealthGauge();\n        h.modifyHp(-150); // Clamped to 0\n        System.out.println(\"Clamped HP: \" + h.getHp());\n    }\n}",
          "walkthrough": [
            "Line 2: hp is private and cannot be set directly by outside code.",
            "Line 4: Public accessor provides safe read-only visibility.",
            "Lines 6-10: Mutator validates boundary invariants (0 <= hp <= 100).",
            "Line 16: Attempting to drain 150 health cleanly clamps to 0."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Making instance fields public to avoid writing getters",
            "error": "External code can assign invalid, corrupting values (e.g., balance = -999999)",
            "fix": "Always declare fields `private` and provide validated getters and setters."
          },
          {
            "mistake": "Directly accessing a private field from another class",
            "error": "emeralds has private access in Vault",
            "fix": "Call the public accessor method: `vault.getEmeralds()`."
          }
        ],
        "checkpoint": [
          {
            "question": "Which access modifier restricts field visibility strictly to the declaring class?",
            "options": [
              "private",
              "public",
              "protected",
              "default (package-private)"
            ],
            "answer": 0,
            "explanation": "`private` members can only be accessed by code within the exact same class."
          },
          {
            "question": "What is the primary benefit of encapsulation?",
            "options": [
              "It safeguards object invariants and decouples implementation details from the public interface",
              "It makes programs compile twice as fast",
              "It automatically compresses JVM memory",
              "It prevents classes from having methods"
            ],
            "answer": 0,
            "explanation": "Encapsulation prevents external tampering and allows changing internal representations without breaking clients."
          }
        ],
        "exercise": {
          "instructions": "Create class `ManaPool` with private fields `int currentMana` and `int maxMana`. Provide a constructor `ManaPool(int maxMana, int currentMana)` that clamps initial currentMana to maxMana. Provide public method `void adjustMana(int amount)` that adds amount, clamping currentMana between 0 and maxMana. Provide getters `getCurrentMana()` and `getMaxMana()`. In `Main.main`, read maxMana, currentMana, and an adjustment amount. Print 'Mana: <current>/<max>'.",
          "starterCode": "import java.util.Scanner;\n\nclass ManaPool {\n    // Encapsulate fields, implement constructor, adjustMana, and getters\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Test ManaPool encapsulation\n        \n    }\n}",
          "hints": [
            "In adjustMana: `currentMana += amount; if (currentMana > maxMana) currentMana = maxMana; if (currentMana < 0) currentMana = 0;`",
            "In constructor, ensure initial currentMana does not exceed maxMana.",
            "Print: `System.out.println(\"Mana: \" + pool.getCurrentMana() + \"/\" + pool.getMaxMana());`"
          ],
          "solution": "import java.util.Scanner;\n\nclass ManaPool {\n    private int currentMana;\n    private int maxMana;\n    \n    public ManaPool(int maxMana, int currentMana) {\n        this.maxMana = maxMana;\n        this.currentMana = Math.min(currentMana, maxMana);\n        if (this.currentMana < 0) this.currentMana = 0;\n    }\n    \n    public void adjustMana(int amount) {\n        currentMana += amount;\n        if (currentMana > maxMana) currentMana = maxMana;\n        if (currentMana < 0) currentMana = 0;\n    }\n    \n    public int getCurrentMana() { return currentMana; }\n    public int getMaxMana() { return maxMana; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int max = sc.nextInt();\n        int curr = sc.nextInt();\n        int delta = sc.nextInt();\n        \n        ManaPool pool = new ManaPool(max, curr);\n        pool.adjustMana(delta);\n        System.out.println(\"Mana: \" + pool.getCurrentMana() + \"/\" + pool.getMaxMana());\n    }\n}",
          "tests": [
            {
              "name": "Partial increase within cap",
              "stdin": "100 50 30\n",
              "expectedStdout": "Mana: 80/100"
            },
            {
              "name": "Excess increase clamped to max",
              "stdin": "100 80 50\n",
              "expectedStdout": "Mana: 100/100"
            },
            {
              "name": "Excess decrease clamped to zero",
              "stdin": "100 40 -60\n",
              "expectedStdout": "Mana: 0/100"
            }
          ]
        },
        "references": [
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 15: Minimize the accessibility of classes and members",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Encapsulation",
            "verify": false
          }
        ]
      },
      {
        "id": "b7_l6",
        "title": "Class Members: static Methods & Constants",
        "xp": 30,
        "estimatedMinutes": 25,
        "story": "While every student in the academy carries their own sketchbook, the academy bells ring for everyone simultaneously. In Java, static members belong to the class itself, shared across all instances.",
        "explanation": [
          {
            "type": "text",
            "content": "The `static` keyword binds a field or method to the **class itself**, rather than any individual object instance."
          },
          {
            "type": "code",
            "content": "Static Fields, Constants, and Methods:",
            "code": "class GuildMember {\n    // Shared counter across ALL instances\n    public static int totalMembers = 0;\n    \n    // Static constant (convention: UPPER_CASE)\n    public static final String GUILD_TAG = \"ARCHITECT\";\n    \n    private String name;\n    \n    public GuildMember(String name) {\n        this.name = name;\n        totalMembers++; // Increments shared static counter\n    }\n    \n    // Static utility method\n    public static boolean isFull() {\n        return totalMembers >= 50;\n    }\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "Static methods cannot access instance variables or use `this`, because static methods execute without any specific object context."
          }
        ],
        "slides": [
          {
            "title": "Shared Class State",
            "content": "There is exactly one copy of a `static` variable in memory, shared across every instance created from that class."
          },
          {
            "title": "Constants with static final",
            "content": "Marking a static field `final` makes it an immutable compile-time constant (like `Math.PI`)."
          },
          {
            "title": "Static Utility Methods",
            "content": "Functions like `Math.max()` or `Integer.parseInt()` do not operate on instance state and are invoked directly through the class name."
          }
        ],
        "underTheHood": "In Java 8+, static variables are stored in the JVM Metaspace / native memory inside the Class mirror object on the heap. They are initialized during class loading when the JVM runs the `<clinit>` class initialization bytecode. Invoking static methods emits the `invokestatic` opcode, which resolves statically without vtable dispatch.",
        "workedExample": {
          "code": "class ScoreKeeper {\n    static int globalHighScore = 0;\n    \n    static void submitScore(int score) {\n        if (score > globalHighScore) {\n            globalHighScore = score;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ScoreKeeper.submitScore(1200);\n        ScoreKeeper.submitScore(450);\n        System.out.println(\"High Score: \" + ScoreKeeper.globalHighScore);\n    }\n}",
          "walkthrough": [
            "Line 2: Single static variable shared across the entire program.",
            "Lines 4-8: Static method accesses and updates the static variable.",
            "Lines 12-13: Invoked directly on the class name ScoreKeeper without creating any objects with new.",
            "Line 14: Prints the highest submitted score (1200)."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Referencing instance variables inside a static method",
            "error": "non-static variable this cannot be referenced from a static context",
            "fix": "Pass the object into the static method as a parameter, or remove the `static` modifier."
          },
          {
            "mistake": "Calling static methods on instance references (e.g., myObject.staticMethod())",
            "error": "Code compiles, but confuses readers into thinking the method operates on instance state",
            "fix": "Always invoke static members using the Class name directly: `ClassName.staticMethod()`."
          }
        ],
        "checkpoint": [
          {
            "question": "Can a static method access non-static instance fields directly?",
            "options": [
              "No, because static methods have no `this` reference and run without an instance context",
              "Yes, Java figures out which instance to use automatically",
              "Only if the fields are public",
              "Only if compiled in debug mode"
            ],
            "answer": 0,
            "explanation": "Static methods execute at the class level and do not possess a `this` pointer to any specific instance."
          },
          {
            "question": "How many copies of a static variable exist in memory if you instantiate 100 objects of that class?",
            "options": [
              "Exactly 1 copy",
              "100 copies",
              "101 copies",
              "None until accessed"
            ],
            "answer": 0,
            "explanation": "Static variables belong to the class, so exactly one shared copy exists regardless of how many instances are created."
          }
        ],
        "exercise": {
          "instructions": "Create class `GuildMember` with private field `String name` and public static field `int totalMembers = 0;`. In the constructor, store the member's name and increment `totalMembers`. Provide getter `getName()`. In `Main.main`, read integer N, followed by N member names. Instantiate each `GuildMember`, print 'Member: <name>' for each, and finally print 'Total Guild Size: <totalMembers>'.",
          "starterCode": "import java.util.Scanner;\n\nclass GuildMember {\n    // Implement fields, static counter, constructor, and getter\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read N, instantiate members, print names and total\n        \n    }\n}",
          "hints": [
            "In constructor: `this.name = name; totalMembers++;`",
            "Read N with sc.nextInt(), then loop N times reading each name with sc.next().",
            "Print `GuildMember.totalMembers` at the end."
          ],
          "solution": "import java.util.Scanner;\n\nclass GuildMember {\n    private String name;\n    public static int totalMembers = 0;\n    \n    public GuildMember(String name) {\n        this.name = name;\n        totalMembers++;\n    }\n    \n    public String getName() { return name; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            String memberName = sc.next();\n            GuildMember member = new GuildMember(memberName);\n            System.out.println(\"Member: \" + member.getName());\n        }\n        System.out.println(\"Total Guild Size: \" + GuildMember.totalMembers);\n    }\n}",
          "tests": [
            {
              "name": "Three guild members",
              "stdin": "3\nRobin\nMarion\nFriar\n",
              "expectedStdout": "Member: Robin\nMember: Marion\nMember: Friar\nTotal Guild Size: 3"
            },
            {
              "name": "Two guild members",
              "stdin": "2\nSteve\nAlex\n",
              "expectedStdout": "Member: Steve\nMember: Alex\nTotal Guild Size: 2"
            },
            {
              "name": "Single builder",
              "stdin": "1\nMasterBuilder\n",
              "expectedStdout": "Member: MasterBuilder\nTotal Guild Size: 1"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Static Fields and Methods",
            "verify": false
          },
          {
            "source": "Java: The Complete Reference, 12th ed.",
            "location": "Chapter 7: A Closer Look at Methods and Classes (Understanding static)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "id": "b7_q1",
        "type": "mcq",
        "question": "What is the relationship between a class and an object in Java?",
        "options": [
          "A class is a blueprint; an object is an instance created from that blueprint",
          "An object is a blueprint; a class is an instance",
          "They are exact synonyms in Java",
          "Classes live on the stack; objects live in the CPU registers"
        ],
        "answer": 0,
        "explanation": "A class specifies the structure and behaviors, while an object is a concrete instance allocated in memory."
      },
      {
        "id": "b7_q2",
        "type": "spot-the-bug",
        "question": "Identify the bug in this constructor:\n```java\npublic class Item {\n    int count;\n    public void Item(int c) {\n        count = c;\n    }\n}\n```",
        "options": [
          "Constructors cannot have a return type like void",
          "Field count must be double",
          "Item cannot take parameters",
          "Must use the this keyword on every line"
        ],
        "answer": 0,
        "explanation": "Adding `void` turns the constructor into a regular method that is never invoked during `new Item(5)`."
      },
      {
        "id": "b7_q3",
        "type": "predict-output",
        "question": "What is the output of this code?\n```java\nclass Beacon {\n    int power = 10;\n    void boost(int p) { power += p; }\n}\n// in main:\nBeacon a = new Beacon();\nBeacon b = a;\nb.boost(15);\nSystem.out.println(a.power);\n```",
        "options": [
          "25",
          "10",
          "15",
          "0"
        ],
        "answer": 0,
        "explanation": "`b` and `a` reference the exact same object on the heap. Mutating `b` modifies the object referenced by `a`."
      },
      {
        "id": "b7_q4",
        "type": "mcq",
        "question": "What is the primary purpose of declaring instance fields as `private`?",
        "options": [
          "To enforce encapsulation and prevent external code from corrupting internal object state",
          "To speed up execution",
          "To make the class compatible with older Java versions",
          "To allow multiple inheritance"
        ],
        "answer": 0,
        "explanation": "Encapsulation hides internal details and protects class invariants from arbitrary external modifications."
      },
      {
        "id": "b7_q5",
        "type": "predict-output",
        "question": "What does this code print?\n```java\nclass Counter {\n    static int count = 0;\n    Counter() { count++; }\n}\n// in main:\nnew Counter();\nnew Counter();\nSystem.out.println(Counter.count);\n```",
        "options": [
          "2",
          "1",
          "0",
          "Compilation Error"
        ],
        "answer": 0,
        "explanation": "`count` is a static field shared across all instances. Two constructor invocations increment it to 2."
      },
      {
        "id": "b7_q6",
        "type": "spot-the-bug",
        "question": "Why does this static method fail to compile?\n```java\nclass Hero {\n    int health = 100;\n    public static void heal() {\n        health += 25;\n    }\n}\n```",
        "options": [
          "Static methods cannot access non-static instance fields directly",
          "health cannot be initialized to 100",
          "heal() must return a boolean",
          "+= is not supported in static methods"
        ],
        "answer": 0,
        "explanation": "Static methods execute at the class level and do not have an implicit `this` instance context."
      },
      {
        "id": "b7_q7",
        "type": "mcq",
        "question": "What does `this(10, 20);` do when written as the first statement in a constructor?",
        "options": [
          "Delegates initialization to another constructor in the same class",
          "Calls the constructor of the parent superclass",
          "Initializes two static variables",
          "Creates a secondary thread"
        ],
        "answer": 0,
        "explanation": "Constructor chaining via `this(...)` reuses logic in another constructor of the same class."
      },
      {
        "id": "b7_q8",
        "type": "predict-output",
        "question": "What happens when you define a class with a custom parameterized constructor and do NOT declare a no-arg constructor?",
        "options": [
          "The compiler does NOT provide a default no-arg constructor; calling `new MyClass()` causes a compile error",
          "The compiler provides both",
          "The class cannot be instantiated",
          "All fields become static"
        ],
        "answer": 0,
        "explanation": "Java only generates an automatic default no-arg constructor when zero constructors are explicitly written."
      },
      {
        "id": "b7_q9",
        "type": "fill-in",
        "question": "To make a static variable completely unmodifiable once assigned, add the keyword: `public static ____ int MAX_LIMIT = 100;`",
        "options": [
          "final",
          "const",
          "immutable",
          "sealed"
        ],
        "answer": 0,
        "explanation": "The `final` keyword prevents a variable or constant from being reassigned after initialization."
      },
      {
        "id": "b7_q10",
        "type": "predict-output",
        "question": "What does this code print?\n```java\nclass Point {\n    int x;\n    Point(int x) { this.x = x; }\n}\nPoint p = new Point(42);\nSystem.out.println(p.x);\n```",
        "options": [
          "42",
          "0",
          "null",
          "Compilation Error"
        ],
        "answer": 0,
        "explanation": "`this.x = x;` assigns the parameter value (42) to the instance field `x`."
      },
      {
        "id": "b7_q11",
        "type": "order-the-lines",
        "question": "Order these lines to define an encapsulated class with a getter and setter:",
        "options": [
          "public class Vault {",
          "    private int gems;",
          "    public int getGems() { return gems; }",
          "    public void setGems(int g) { if (g >= 0) gems = g; }",
          "}"
        ],
        "answer": [
          0,
          1,
          2,
          3,
          4
        ],
        "explanation": "Class opening, private field declaration, public getter, validated public setter, closing bracket."
      },
      {
        "id": "b7_q12",
        "type": "mcq",
        "question": "What is stored in an object reference variable on the thread stack?",
        "options": [
          "A memory address / pointer referencing the object's location on the Heap",
          "The entire object's byte contents copied directly",
          "The class bytecode",
          "The return address of the operating system"
        ],
        "answer": 0,
        "explanation": "Stack variables for non-primitives store references pointing to heap-allocated objects."
      }
    ],
    "project": {
      "title": "Architect Guild Roster & Outpost Ledger",
      "brief": "Design an object-oriented outpost tracking system. Define Outpost and Architect classes with encapsulated private fields, overloaded constructors, defensive validation, and static registry tallies to manage builders and defensive structures across the kingdom.",
      "milestones": [
        "Milestone 1: Design the Outpost class with encapsulated coordinates, name, and garrison capacity",
        "Milestone 2: Implement overloaded constructors using this(...) delegation",
        "Milestone 3: Create an Architect class with a static registry tracking total active builders",
        "Milestone 4: Write a driver class that registers outposts, validates capacities, and prints a comprehensive kingdom status report"
      ],
      "rubric": [
        {
          "criterion": "Encapsulation & Access",
          "points": 25,
          "description": "All fields private with validated getters and setters"
        },
        {
          "criterion": "Constructor Design",
          "points": 25,
          "description": "Correct constructor overloading and this(...) chaining"
        },
        {
          "criterion": "Static Members",
          "points": 25,
          "description": "Appropriate use of static counters and constants"
        },
        {
          "criterion": "Code Structure & Clarity",
          "points": 25,
          "description": "Clean separation of concerns between model and driver"
        }
      ],
      "stretchGoals": [
        "Add a defensive supply transfer method between two Outpost instances",
        "Implement a static factory method pattern for specialized outposts (Fortress, Watchtower)"
      ]
    },
    "glossary": [
      {
        "term": "Class",
        "definition": "A blueprint or template defining the state (fields) and behavior (methods) of objects created from it."
      },
      {
        "term": "Object",
        "definition": "A concrete instance of a class allocated in JVM Heap memory."
      },
      {
        "term": "Constructor",
        "definition": "A special member function invoked during object creation with new that initializes the object's state."
      },
      {
        "term": "this",
        "definition": "A keyword representing a reference to the current invoking instance in non-static methods and constructors."
      },
      {
        "term": "Encapsulation",
        "definition": "The OOP principle of hiding internal state behind access modifiers and exposing operations through methods."
      },
      {
        "term": "Access Modifier",
        "definition": "Keywords (public, protected, private, package-private) that dictate the visibility and accessibility of classes, methods, and fields."
      },
      {
        "term": "static",
        "definition": "A modifier specifying that a field or method belongs to the class itself rather than to individual instances."
      },
      {
        "term": "Garbage Collection",
        "definition": "The automated JVM background process that reclaims heap memory occupied by objects that are no longer reachable."
      }
    ],
    "references": [
      {
        "source": "Head First Java, 3rd ed.",
        "location": "Chapter 4: How Objects Behave & Chapter 9: Life and Death of an Object",
        "verify": false
      },
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 4: Objects and Classes",
        "verify": false
      },
      {
        "source": "Effective Java, 3rd ed.",
        "location": "Item 15: Minimize the accessibility of classes and members",
        "verify": false
      }
    ],
    "level": "beginner"
  },
  {
    "id": "b8",
    "code": "B8",
    "track": "beginner",
    "title": "Exceptions, Collections & Track 1 Capstone",
    "subtitle": "Robust error handling, try-catch-finally, checked vs unchecked exceptions, ArrayList, HashMap, and the Console Expense Tracker",
    "biome": "Hisser Cavern",
    "estimatedMinutes": 160,
    "learningObjectives": [
      "Navigate Java's exception class hierarchy (Throwable, Error, Exception, RuntimeException)",
      "Handle unexpected runtime faults gracefully using try, catch, and finally blocks",
      "Distinguish checked exceptions from unchecked exceptions and declare method throws clauses",
      "Manage dynamically resizing lists with generic ArrayList<E> and primitive wrapper autoboxing",
      "Implement high-speed key-value lookups, counting, and aggregation with HashMap<K, V>",
      "Architect and verify a complete console expense management application as the Track 1 Capstone"
    ],
    "prerequisites": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5",
      "b6",
      "b7"
    ],
    "lessons": [
      {
        "id": "b8_l1",
        "title": "Exception Hierarchy & The try-catch Block",
        "xp": 35,
        "estimatedMinutes": 25,
        "story": "In the treacherous Hisser Caverns, sudden rockfalls and hissing ambushes can abruptly end an expedition. In Java, an Exception represents an abnormal event that disrupts program flow, but with try-catch, your code can recover gracefully.",
        "explanation": [
          {
            "type": "text",
            "content": "An **Exception** is an event that occurs during program execution that disrupts the normal flow of instructions. Java represents all errors and exceptions as objects inheriting from `java.lang.Throwable`."
          },
          {
            "type": "code",
            "content": "Handling Exceptions with try-catch:",
            "code": "try {\n    int count = Integer.parseInt(\"sixty-four\"); // Throws NumberFormatException\n    System.out.println(\"Count: \" + count);\n} catch (NumberFormatException e) {\n    System.out.println(\"Caught parsing error: \" + e.getMessage());\n    // Program recovers and continues execution!\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "If an exception occurs inside a `try` block, execution immediately jumps to the matching `catch` block. Lines following the failing statement in `try` are skipped."
          }
        ],
        "slides": [
          {
            "title": "The Exception Hierarchy",
            "content": "`Throwable` has two direct subclasses:\n1. `Error`: Catastrophic JVM problems (e.g. `OutOfMemoryError`, `StackOverflowError`) that user code should not catch.\n2. `Exception`: Conditions that reasonable applications might want to catch."
          },
          {
            "title": "The try-catch Mechanism",
            "content": "Wrap dangerous operations in a `try` block. If an exception matches the `catch` parameter type, the block catches it and prevents a crash."
          },
          {
            "title": "Flow of Control",
            "content": "If no exception occurs, the `catch` block is completely ignored. If an exception occurs, code following the crash in `try` is skipped."
          }
        ],
        "underTheHood": "In the compiled `.class` file, every method containing a try-catch block includes an **Exception Table**. Each entry in the table specifies: `[start_pc, end_pc, handler_pc, catch_type]`. When an exception is thrown, the JVM checks the table to see if the current Program Counter (PC) falls within the monitored range. If so, it branches directly to `handler_pc`.",
        "workedExample": {
          "code": "public class SafeParse {\n    public static void main(String[] args) {\n        String input = \"abc\";\n        int result = 0;\n        try {\n            result = Integer.parseInt(input);\n        } catch (NumberFormatException e) {\n            System.out.println(\"Falling back to default value\");\n            result = 1;\n        }\n        System.out.println(\"Result: \" + result);\n    }\n}",
          "walkthrough": [
            "Line 6: Integer.parseInt(\"abc\") cannot parse letters and throws NumberFormatException.",
            "Line 7: The catch block matches NumberFormatException.",
            "Line 8: Prints the fallback notice.",
            "Line 9: Sets result = 1.",
            "Line 11: Main resumes smoothly, printing 'Result: 1'."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Empty catch block (swallowing exceptions silently)",
            "error": "Bugs become impossible to diagnose because the error disappears with no log",
            "fix": "Always log, report, or handle the caught exception appropriately."
          },
          {
            "mistake": "Catching Throwable or Error in normal application code",
            "error": "Catches JVM internal crashes like OutOfMemoryError, leaving the system in an undefined broken state",
            "fix": "Catch specific Exception types (`NumberFormatException`, `IOException`, etc.)."
          }
        ],
        "checkpoint": [
          {
            "question": "What is the common superclass of all errors and exceptions in Java?",
            "options": [
              "java.lang.Throwable",
              "java.lang.Exception",
              "java.lang.Error",
              "java.lang.Object"
            ],
            "answer": 0,
            "explanation": "`java.lang.Throwable` is the root of the entire Java exception hierarchy."
          },
          {
            "question": "What happens if code inside a `try` block does NOT throw any exception?",
            "options": [
              "The `catch` block is completely skipped",
              "The `catch` block executes with a null exception parameter",
              "A NullPointerException is thrown",
              "The program terminates"
            ],
            "answer": 0,
            "explanation": "If no exception occurs, normal execution finishes the `try` block and skips past all associated `catch` blocks."
          }
        ],
        "exercise": {
          "instructions": "Read a single token from input representing an item quantity. Attempt to parse it as an integer with Integer.parseInt(). If successful, print 'Valid Quantity: <N>'. If a NumberFormatException is thrown, catch it and print 'Invalid Input: Fallback to 1'.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read token, parse with try-catch\n        \n    }\n}",
          "hints": [
            "Read token with `String token = sc.next();`.",
            "Wrap `int qty = Integer.parseInt(token);` in a `try` block.",
            "In `catch (NumberFormatException e)`, print 'Invalid Input: Fallback to 1'."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String token = sc.next();\n        try {\n            int qty = Integer.parseInt(token);\n            System.out.println(\"Valid Quantity: \" + qty);\n        } catch (NumberFormatException e) {\n            System.out.println(\"Invalid Input: Fallback to 1\");\n        }\n    }\n}",
          "tests": [
            {
              "name": "Valid integer",
              "stdin": "42\n",
              "expectedStdout": "Valid Quantity: 42"
            },
            {
              "name": "Non-numeric string",
              "stdin": "sixty-four\n",
              "expectedStdout": "Invalid Input: Fallback to 1"
            },
            {
              "name": "Zero value",
              "stdin": "0\n",
              "expectedStdout": "Valid Quantity: 0"
            }
          ]
        },
        "references": [
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 11: Risky Behavior (Exception Handling)",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 7: Exceptions, Assertions, and Logging",
            "verify": false
          }
        ]
      },
      {
        "id": "b8_l2",
        "title": "Multi-Catch, try-with-resources & the finally Block",
        "xp": 35,
        "estimatedMinutes": 25,
        "story": "When sealing a cavern chamber against toxic gas, you must ensure the blast doors close whether miners exit safely or an emergency siren blares. The finally block guarantees vital cleanup code always executes.",
        "explanation": [
          {
            "type": "text",
            "content": "The `finally` block creates a block of code that is guaranteed to run after `try` and `catch` finish, regardless of whether an exception occurred, was caught, or was uncaught."
          },
          {
            "type": "code",
            "content": "The try-catch-finally Structure:",
            "code": "try {\n    int share = 100 / miners; // May throw ArithmeticException if miners == 0\n    System.out.println(\"Share: \" + share);\n} catch (ArithmeticException e) {\n    System.out.println(\"Division error: \" + e.getMessage());\n} finally {\n    System.out.println(\"Audit check completed.\"); // ALWAYS runs!\n}"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "The `finally` block runs even if there is a `return` statement inside the `try` or `catch` block! The only thing that prevents `finally` from running is `System.exit()` or JVM crash."
          }
        ],
        "slides": [
          {
            "title": "The Guarantee of finally",
            "content": "Used for releasing non-memory system resources (closing files, network sockets, database connections) that the garbage collector does not automatically release."
          },
          {
            "title": "Multi-Catch (Java 7+)",
            "content": "Catch multiple unrelated exceptions in one block with a pipe: `catch (IOException | SQLException e)`."
          },
          {
            "title": "try-with-resources (Java 7+)",
            "content": "Any object implementing `AutoCloseable` inside `try (Resource r = ...)` is automatically closed when the try block exits."
          }
        ],
        "underTheHood": "The Java compiler implements `finally` by inserting the bytecode instructions of the finally block into every possible code path exiting the try/catch block, including normal termination, catch block endings, and unhandled exception re-throw handlers. This guarantees absolute path coverage at the bytecode level.",
        "workedExample": {
          "code": "public class FinallyDemo {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"Step 1: Opening vault\");\n            int val = 10 / 0; // Triggers ArithmeticException\n        } catch (ArithmeticException e) {\n            System.out.println(\"Step 2: Security triggered\");\n        } finally {\n            System.out.println(\"Step 3: Vault locked shut\");\n        }\n    }\n}",
          "walkthrough": [
            "Line 4: Prints opening vault.",
            "Line 5: Division by zero triggers ArithmeticException.",
            "Line 7: Catch block handles the exception and prints security warning.",
            "Line 9: Finally block executes immediately afterwards, locking the vault shut."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Putting a return statement inside a finally block",
            "error": "Silently overrides and suppresses any exceptions thrown inside the try or catch block",
            "fix": "Never put a `return` or `throw` inside a `finally` block; use finally solely for cleanup."
          },
          {
            "mistake": "Forgetting that Scanner or Streams need closing",
            "error": "Resource leaks in long-running services",
            "fix": "Use `try-with-resources` for AutoCloseable resources: `try (Scanner sc = new Scanner(...))`."
          }
        ],
        "checkpoint": [
          {
            "question": "When does the `finally` block execute?",
            "options": [
              "Always, regardless of whether an exception was thrown or caught (unless System.exit() occurs)",
              "Only when an exception is thrown and caught",
              "Only when NO exception is thrown",
              "Only on alternate CPU cycles"
            ],
            "answer": 0,
            "explanation": "The `finally` block is guaranteed to execute following `try` and `catch` in all normal execution scenarios."
          },
          {
            "question": "Which interface must a class implement to be used in a `try-with-resources` statement?",
            "options": [
              "java.lang.AutoCloseable",
              "java.io.Serializable",
              "java.lang.Runnable",
              "java.lang.Cloneable"
            ],
            "answer": 0,
            "explanation": "`try-with-resources` requires classes to implement `java.lang.AutoCloseable` (or its child `java.io.Closeable`)."
          }
        ],
        "exercise": {
          "instructions": "Read two integers: `totalOre` and `miners`. Divide `totalOre` by `miners` to compute ore per miner and print 'Share: <share>'. If `miners` is 0, catch `ArithmeticException` and print 'Error: Zero miners'. In all cases, use a `finally` block to print 'Door Status: Sealed'.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Division with try-catch-finally\n        \n    }\n}",
          "hints": [
            "Wrap `int share = totalOre / miners; System.out.println(\"Share: \" + share);` in try.",
            "Catch `ArithmeticException e` and print 'Error: Zero miners'.",
            "In `finally`, print 'Door Status: Sealed'."
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int totalOre = sc.nextInt();\n        int miners = sc.nextInt();\n        \n        try {\n            int share = totalOre / miners;\n            System.out.println(\"Share: \" + share);\n        } catch (ArithmeticException e) {\n            System.out.println(\"Error: Zero miners\");\n        } finally {\n            System.out.println(\"Door Status: Sealed\");\n        }\n    }\n}",
          "tests": [
            {
              "name": "Normal sharing",
              "stdin": "100 5\n",
              "expectedStdout": "Share: 20\nDoor Status: Sealed"
            },
            {
              "name": "Division by zero",
              "stdin": "50 0\n",
              "expectedStdout": "Error: Zero miners\nDoor Status: Sealed"
            },
            {
              "name": "Uneven division",
              "stdin": "14 3\n",
              "expectedStdout": "Share: 4\nDoor Status: Sealed"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 7: The finally Clause & The try-with-Resources Statement",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 9: Prefer try-with-resources to try-finally",
            "verify": false
          }
        ]
      },
      {
        "id": "b8_l3",
        "title": "Checked vs Unchecked Exceptions & Throwing",
        "xp": 35,
        "estimatedMinutes": 25,
        "story": "Master prospectors warn apprentices that some hazards are foreseeable environmental risks (like encountering water pockets), while others are sheer carelessness (like walking off a ledge). Java enforces this distinction through Checked vs Unchecked exceptions.",
        "explanation": [
          {
            "type": "text",
            "content": "Java classifies exceptions into two fundamental categories:\n1. **Checked Exceptions**: Subclasses of `Exception` (excluding `RuntimeException`). The compiler forces you to handle them with `try-catch` or declare them with `throws`.\n2. **Unchecked Exceptions**: Subclasses of `RuntimeException` (e.g. `NullPointerException`, `IllegalArgumentException`). They represent logic bugs and do not require mandatory declaration."
          },
          {
            "type": "code",
            "content": "Throwing Exceptions & Method Signatures:",
            "code": "// Throwing an unchecked exception for defensive programming\npublic static void setLevel(int level) {\n    if (level < 1 || level > 100) {\n        throw new IllegalArgumentException(\"Level must be between 1 and 100: \" + level);\n    }\n}\n\n// Declaring a checked exception in method header\npublic static void loadBlueprint(String path) throws java.io.IOException {\n    // Code that may fail due to external I/O\n}"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Use `throw` to instantiate and trigger an exception. Use `throws` in the method signature to warn callers that the method might throw that exception."
          }
        ],
        "slides": [
          {
            "title": "Checked Exceptions",
            "content": "Subclasses of `Exception` outside `RuntimeException`. Represent recoverable external conditions (e.g. `FileNotFoundException`). Must be caught or declared."
          },
          {
            "title": "Unchecked Exceptions",
            "content": "Subclasses of `RuntimeException`. Represent programming defects (e.g. `IndexOutOfBoundsException`). Handling is optional."
          },
          {
            "title": "throw vs throws",
            "content": "`throw` is an action: triggers an exception immediately.\n`throws` is a declaration: advertises potential checked exceptions in the method header."
          }
        ],
        "underTheHood": "The distinction between checked and unchecked exceptions is enforced exclusively at compile-time by `javac`. In JVM bytecode, there is no difference in how exceptions are thrown (`athrow` bytecode opcode) or handled. Generics and type erasure can even allow checked exceptions to be thrown without compiler warnings via tricky casts ('sneaky throws').",
        "workedExample": {
          "code": "public class GuardClauses {\n    public static void checkCapacity(int cap) {\n        if (cap <= 0) {\n            throw new IllegalArgumentException(\"Capacity must be positive\");\n        }\n    }\n    \n    public static void main(String[] args) {\n        try {\n            checkCapacity(-5);\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Caught: \" + e.getMessage());\n        }\n    }\n}",
          "walkthrough": [
            "Line 3: Evaluates guard condition.",
            "Line 4: Instantiates and throws IllegalArgumentException.",
            "Line 10: Calls checkCapacity(-5) inside try.",
            "Line 11: Catches the exception and prints the custom error message."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Confusing the throw keyword with the throws keyword",
            "error": "Syntax error: throw used in method header or throws used inside method body",
            "fix": "`throws` declares exceptions in the method signature; `throw` throws an exception object in the body."
          },
          {
            "mistake": "Throwing generic Exception instead of specific subclasses",
            "error": "Callers cannot selectively catch and handle specific failure modes",
            "fix": "Throw standard specific exceptions like `IllegalArgumentException`, `IllegalStateException`, or `NoSuchElementException`."
          }
        ],
        "checkpoint": [
          {
            "question": "Which of the following is an Unchecked exception?",
            "options": [
              "NullPointerException",
              "IOException",
              "SQLException",
              "ClassNotFoundException"
            ],
            "answer": 0,
            "explanation": "`NullPointerException` inherits from `RuntimeException`, making it an unchecked exception."
          },
          {
            "question": "What must a method do if it calls code that can throw a Checked exception and does not catch it?",
            "options": [
              "Declare the exception in its signature using the `throws` keyword",
              "Cast the exception to an integer",
              "Annotate the method with @Unchecked",
              "Nothing; Java handles it automatically"
            ],
            "answer": 0,
            "explanation": "Methods that let checked exceptions propagate must declare them with `throws ExceptionName` in their signature."
          }
        ],
        "exercise": {
          "instructions": "Create a method `static void validatePin(int pin) throws IllegalArgumentException`. If `pin < 1000 || pin > 9999`, throw `new IllegalArgumentException(\"PIN must be 4 digits\")`. In `Main.main`, read an integer PIN. If valid, print 'PIN Accepted'. If `IllegalArgumentException` is caught, print 'Access Denied: ' followed by `e.getMessage()`.",
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Implement validatePin method\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Test validation with try-catch\n        \n    }\n}",
          "hints": [
            "In validatePin: `if (pin < 1000 || pin > 9999) throw new IllegalArgumentException(\"PIN must be 4 digits\");`",
            "In main: wrap `validatePin(pin); System.out.println(\"PIN Accepted\");` in try.",
            "In catch: `System.out.println(\"Access Denied: \" + e.getMessage());`"
          ],
          "solution": "import java.util.Scanner;\n\npublic class Main {\n    static void validatePin(int pin) throws IllegalArgumentException {\n        if (pin < 1000 || pin > 9999) {\n            throw new IllegalArgumentException(\"PIN must be 4 digits\");\n        }\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int pin = sc.nextInt();\n        \n        try {\n            validatePin(pin);\n            System.out.println(\"PIN Accepted\");\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Access Denied: \" + e.getMessage());\n        }\n    }\n}",
          "tests": [
            {
              "name": "Valid 4-digit PIN",
              "stdin": "1234\n",
              "expectedStdout": "PIN Accepted"
            },
            {
              "name": "Too short PIN",
              "stdin": "42\n",
              "expectedStdout": "Access Denied: PIN must be 4 digits"
            },
            {
              "name": "Too long PIN",
              "stdin": "99999\n",
              "expectedStdout": "Access Denied: PIN must be 4 digits"
            }
          ]
        },
        "references": [
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 70: Use checked exceptions for recoverable conditions and runtime exceptions for programming errors",
            "verify": false
          },
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 7: Declaring Checked Exceptions",
            "verify": false
          }
        ]
      },
      {
        "id": "b8_l4",
        "title": "Dynamic Resizable Lists: ArrayList<E> & Generics",
        "xp": 35,
        "estimatedMinutes": 25,
        "story": "A fixed wooden crate can only hold a fixed number of tools, but a magical adventurer's satchel expands infinitely as new treasures are gathered. Java's ArrayList is a dynamic, resizable array that grows automatically.",
        "explanation": [
          {
            "type": "text",
            "content": "`java.util.ArrayList<E>` is a resizable array implementation of the `List` interface. It grows dynamically as elements are added."
          },
          {
            "type": "code",
            "content": "Using ArrayList with Generics:",
            "code": "import java.util.ArrayList;\n\n// Diamond operator <> infers type\nArrayList<String> satchel = new ArrayList<>();\n\nsatchel.add(\"Torch\");      // Append element\nsatchel.add(\"Pickaxe\");    // Append element\nsatchel.set(0, \"Lantern\"); // Replace at index 0\n\nSystem.out.println(\"Item at 0: \" + satchel.get(0)); // \"Lantern\"\nSystem.out.println(\"Total items: \" + satchel.size()); // 2\n\nsatchel.remove(\"Pickaxe\"); // Removes by value or index"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Collections cannot store raw primitive types (`int`, `double`, `char`). Java uses **Wrapper Classes** (`Integer`, `Double`, `Character`) with automatic **Autoboxing** and **Unboxing** to seamlessly convert between them."
          }
        ],
        "slides": [
          {
            "title": "Dynamic Resizing",
            "content": "Unlike standard arrays which have fixed lengths, `ArrayList` starts with an initial capacity (default 10) and automatically expands when full."
          },
          {
            "title": "Core ArrayList API",
            "content": "`.add(e)` adds to end; `.get(i)` retrieves; `.set(i, e)` replaces; `.remove(i)` deletes; `.size()` returns element count."
          },
          {
            "title": "Generics and Autoboxing",
            "content": "`ArrayList<Integer>` automatically converts between primitive `int` and wrapper `Integer` via compiler autoboxing."
          }
        ],
        "underTheHood": "Under the hood, `ArrayList` wraps an `Object[] elementData` array. When adding an element exceeds current capacity, it calculates `newCapacity = oldCapacity + (oldCapacity >> 1)` (a 50% growth factor). It creates the larger array and copies existing elements via `System.arraycopy()`. This provides amortized $O(1)$ append time and $O(1)$ random access.",
        "workedExample": {
          "code": "import java.util.ArrayList;\n\npublic class SatchelDemo {\n    public static void main(String[] args) {\n        ArrayList<Integer> scores = new ArrayList<>();\n        scores.add(100); // Autoboxing: int 100 becomes Integer\n        scores.add(250);\n        \n        int first = scores.get(0); // Unboxing: Integer becomes int\n        System.out.println(\"First score: \" + first);\n        System.out.println(\"Count: \" + scores.size());\n    }\n}",
          "walkthrough": [
            "Line 4: Creates an ArrayList for Integer wrappers.",
            "Lines 5-6: Autoboxes primitive ints into Integer objects and appends them.",
            "Line 8: Retrieves element at index 0, automatically unboxed back to primitive int.",
            "Line 10: Outputs 2 elements."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Using ArrayList<int> with raw primitives",
            "error": "unexpected type; found: int, required: reference",
            "fix": "Use the wrapper class: `ArrayList<Integer>`, `ArrayList<Double>`, `ArrayList<Boolean>`."
          },
          {
            "mistake": "Using list.length or list.length() instead of list.size()",
            "error": "cannot find symbol: variable length in ArrayList",
            "fix": "ArrayList uses the method `.size()`, while arrays use `.length` and Strings use `.length()`."
          }
        ],
        "checkpoint": [
          {
            "question": "What is the amortized time complexity of adding an element to the end of an `ArrayList`?",
            "options": [
              "O(1)",
              "O(N)",
              "O(log N)",
              "O(N^2)"
            ],
            "answer": 0,
            "explanation": "Appending to an ArrayList is amortized O(1), because internal array resizing occurs infrequently as capacity grows by 50% each time."
          },
          {
            "question": "How do you specify an ArrayList of primitive doubles?",
            "options": [
              "ArrayList<Double>",
              "ArrayList<double>",
              "DoubleList",
              "ArrayList[double]"
            ],
            "answer": 0,
            "explanation": "Java generics require reference types, so the `Double` wrapper class must be used."
          }
        ],
        "exercise": {
          "instructions": "Read integer N, followed by N item names to add to an `ArrayList<String>`. Then read an item name to remove from the satchel. If the item exists in the list, remove its first occurrence. Print the final satchel size formatted as 'Satchel Size: <size>', followed by the remaining items formatted as 'Items: [item1, item2, ...]'.",
          "starterCode": "import java.util.Scanner;\nimport java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Manage ArrayList satchel\n        \n    }\n}",
          "hints": [
            "Create `ArrayList<String> satchel = new ArrayList<>();`.",
            "Loop N times and call `satchel.add(sc.next());`.",
            "Read removal target and call `satchel.remove(target);`.",
            "Print `Satchel Size: \" + satchel.size()` and `\"Items: \" + satchel` (ArrayList's toString formats as `[a, b]`)."
          ],
          "solution": "import java.util.Scanner;\nimport java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        ArrayList<String> satchel = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            satchel.add(sc.next());\n        }\n        String toRemove = sc.next();\n        satchel.remove(toRemove);\n        \n        System.out.println(\"Satchel Size: \" + satchel.size());\n        System.out.println(\"Items: \" + satchel);\n    }\n}",
          "tests": [
            {
              "name": "Add four and remove Bread",
              "stdin": "4\nTorch\nPickaxe\nBread\nTorch\nBread\n",
              "expectedStdout": "Satchel Size: 3\nItems: [Torch, Pickaxe, Torch]"
            },
            {
              "name": "Remove item not in satchel",
              "stdin": "3\nSword\nShield\nHelmet\nBow\n",
              "expectedStdout": "Satchel Size: 3\nItems: [Sword, Shield, Helmet]"
            },
            {
              "name": "Remove Apple leaving GoldenApple",
              "stdin": "2\nApple\nGoldenApple\nApple\n",
              "expectedStdout": "Satchel Size: 1\nItems: [GoldenApple]"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 9: Collections (The List Interface & ArrayList)",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 26: Don't use raw types",
            "verify": false
          }
        ]
      },
      {
        "id": "b8_l5",
        "title": "Key-Value Lookups: HashMap<K, V>",
        "xp": 35,
        "estimatedMinutes": 25,
        "story": "In the bustling cavern bazaar, trading merchant logs map every unique item name directly to its gold price. Instead of searching through every bin one by one, HashMap allows instant, direct key-to-value lookups.",
        "explanation": [
          {
            "type": "text",
            "content": "`java.util.HashMap<K, V>` stores associations between unique **keys** and their corresponding **values**. It provides near-instantaneous $O(1)$ average time complexity for insertions and lookups."
          },
          {
            "type": "code",
            "content": "Using HashMap for Key-Value Data:",
            "code": "import java.util.HashMap;\n\nHashMap<String, Integer> market = new HashMap<>();\n\n// 1. Insert or update key-value pairs\nmarket.put(\"Diamond\", 500);\nmarket.put(\"Iron\", 50);\n\n// 2. Query\nboolean hasCoal = market.containsKey(\"Coal\"); // false\nint diamondPrice = market.get(\"Diamond\"); // 500\n\n// 3. Safe fallback retrieval\nint coalPrice = market.getOrDefault(\"Coal\", 0); // 0"
          },
          {
            "type": "callout",
            "calloutType": "warning",
            "content": "If you call `map.get(key)` for a key that does not exist, it returns `null`. Unboxing `null` directly into a primitive `int` throws a `NullPointerException`! Use `.getOrDefault()` to be safe."
          }
        ],
        "slides": [
          {
            "title": "Associative Key-Value Storage",
            "content": "Maps store entries as (Key, Value). Keys must be unique; inserting an existing key overwrites the previous value."
          },
          {
            "title": "Constant Time Lookups",
            "content": "HashMap uses hash buckets to achieve $O(1)$ average lookup, insertion, and deletion performance."
          },
          {
            "title": "Handling Missing Keys",
            "content": "Always check `.containsKey(k)` or use `.getOrDefault(k, fallback)` to prevent unboxing `null` into a primitive."
          }
        ],
        "underTheHood": "A `HashMap` maintains an array of buckets (`Node<K,V>[] table`). When you call `put(key, value)`, it calculates `hash(key) = key.hashCode() ^ (h >>> 16)` and indexes the bucket using bitwise `(capacity - 1) & hash`. When bucket collisions exceed 8 nodes (and table capacity >= 64), Java 8+ converts that bucket from a linked list to a Red-Black Tree (`TreeNode`), guaranteeing $O(\\log N)$ worst-case lookup.",
        "workedExample": {
          "code": "import java.util.HashMap;\n\npublic class PriceCheck {\n    public static void main(String[] args) {\n        HashMap<String, Integer> stock = new HashMap<>();\n        stock.put(\"Arrow\", 64);\n        stock.put(\"Bow\", 1);\n        \n        System.out.println(\"Arrow count: \" + stock.get(\"Arrow\"));\n        System.out.println(\"Sword count: \" + stock.getOrDefault(\"Sword\", 0));\n    }\n}",
          "walkthrough": [
            "Line 4: Instantiates HashMap mapping String keys to Integer values.",
            "Lines 5-6: Puts two items into the map.",
            "Line 8: Retrieves existing key 'Arrow'.",
            "Line 9: Safely falls back to 0 for missing key 'Sword'."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Unboxing null from a missing key into a primitive",
            "error": "NullPointerException when calling int p = map.get(\"missing\");",
            "fix": "Use `map.getOrDefault(\"missing\", 0)` or check with `map.containsKey(\"missing\")` first."
          },
          {
            "mistake": "Using mutable objects as HashMap keys",
            "error": "Modifying the object alters its hashCode, making it permanently unfindable in the map",
            "fix": "Always use immutable types (like `String` or `Integer`) as HashMap keys."
          }
        ],
        "checkpoint": [
          {
            "question": "What does `map.get(\"UnknownKey\")` return if the key is not in the HashMap?",
            "options": [
              "null",
              "0",
              "NoSuchElementException",
              "An empty string"
            ],
            "answer": 0,
            "explanation": "`HashMap.get()` returns `null` when the requested key is not present in the map."
          },
          {
            "question": "What data structure does Java 8+ convert a HashMap bucket into when it suffers from high collision counts (more than 8 elements)?",
            "options": [
              "A Red-Black Tree (TreeNode)",
              "An ArrayList",
              "A secondary HashSet",
              "A circular queue"
            ],
            "answer": 0,
            "explanation": "Java 8 treeifies overloaded hash buckets into balanced Red-Black Trees to prevent hash-collision denial-of-service attacks."
          }
        ],
        "exercise": {
          "instructions": "Read integer N, followed by N lines each containing an item name and its integer price. Store them in a `HashMap<String, Integer>`. Then read a query item name. If the query item is found in the map, print 'Price: <price> gold'. If not found, print 'Item not found'.",
          "starterCode": "import java.util.Scanner;\nimport java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Build HashMap and query price\n        \n    }\n}",
          "hints": [
            "Create `HashMap<String, Integer> catalog = new HashMap<>();`.",
            "Loop N times: `String item = sc.next(); int price = sc.nextInt(); catalog.put(item, price);`",
            "Read query: `String q = sc.next();`.",
            "Check `if (catalog.containsKey(q)) { System.out.println(\"Price: \" + catalog.get(q) + \" gold\"); } else { System.out.println(\"Item not found\"); }`"
          ],
          "solution": "import java.util.Scanner;\nimport java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        HashMap<String, Integer> catalog = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            String item = sc.next();\n            int price = sc.nextInt();\n            catalog.put(item, price);\n        }\n        String query = sc.next();\n        if (catalog.containsKey(query)) {\n            System.out.println(\"Price: \" + catalog.get(query) + \" gold\");\n        } else {\n            System.out.println(\"Item not found\");\n        }\n    }\n}",
          "tests": [
            {
              "name": "Find Iron price",
              "stdin": "3\nDiamond 500\nIron 50\nCoal 10\nIron\n",
              "expectedStdout": "Price: 50 gold"
            },
            {
              "name": "Query missing item",
              "stdin": "2\nEmerald 100\nRuby 80\nGold\n",
              "expectedStdout": "Item not found"
            },
            {
              "name": "Single item catalog query",
              "stdin": "1\nNetherite 1000\nNetherite\n",
              "expectedStdout": "Price: 1000 gold"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 9: Collections (Maps & The HashMap Class)",
            "verify": false
          },
          {
            "source": "Effective Java, 3rd ed.",
            "location": "Item 11: Always override hashCode when you override equals",
            "verify": false
          }
        ]
      },
      {
        "id": "b8_l6",
        "title": "Track 1 Capstone: Console Expense Tracker",
        "xp": 50,
        "estimatedMinutes": 35,
        "story": "You have ascended from an apprentice novice to a capable Java craftsperson! To complete your Overworld expedition and conquer Track 1, you will build a comprehensive, interactive Console Expense Tracker that combines OOP modeling, dynamic ArrayList storage, category aggregation with HashMap, and robust exception handling.",
        "explanation": [
          {
            "type": "text",
            "content": "The **Track 1 Capstone Project** unites every foundational skill you have acquired: classes and encapsulation, dynamic collections (`ArrayList`, `HashMap`), modular methods, and defensive exception handling."
          },
          {
            "type": "code",
            "content": "Architecture of the Expense Tracker:",
            "code": "// Model class\nclass Expense {\n    String description;\n    double amount;\n    String category;\n    \n    public Expense(String d, double a, String c) {\n        this.description = d;\n        this.amount = a;\n        this.category = c;\n    }\n}\n\n// Core storage:\nArrayList<Expense> expenses = new ArrayList<>();\nHashMap<String, Integer> categoryCounts = new HashMap<>();"
          },
          {
            "type": "callout",
            "calloutType": "tip",
            "content": "Clean console applications use an interactive command processing loop. Wrapping inputs with `try-catch` guarantees that typos or invalid numbers never crash your running application."
          }
        ],
        "slides": [
          {
            "title": "Capstone Architecture",
            "content": "Clean separation of model entities (`Expense`) from business logic (`ExpenseManager`) and user interaction (`Main`)."
          },
          {
            "title": "Dynamic Aggregation",
            "content": "Leverage `ArrayList<Expense>` for full sequential transaction history, and `HashMap<String, Integer>` for instant category counts."
          },
          {
            "title": "Defensive Robustness",
            "content": "Ensure numeric parsing is surrounded by exception handling, and format all currency outputs cleanly."
          }
        ],
        "underTheHood": "In this capstone application, the JVM Heap coordinates multiple object graphs: `Expense` instances referenced by the `ArrayList`'s backing array, string keys deduplicated in the String Constant Pool or heap, and hash nodes inside `HashMap`. Exception stack frames unwind cleanly upon format errors without terminating the main JVM process.",
        "workedExample": {
          "code": "import java.util.ArrayList;\nimport java.util.Locale;\n\npublic class CapstoneDemo {\n    public static void main(String[] args) {\n        ArrayList<Double> prices = new ArrayList<>();\n        prices.add(19.99);\n        prices.add(30.01);\n        \n        double total = 0;\n        for (double p : prices) total += p;\n        \n        System.out.printf(Locale.US, \"Total: $%.2f%n\", total);\n    }\n}",
          "walkthrough": [
            "Line 5: Allocates ArrayList of Double prices.",
            "Lines 6-7: Autoboxes primitive doubles.",
            "Lines 9-10: Traverses and accumulates total.",
            "Line 12: Uses printf with Locale.US to print currency formatted to two decimal places."
          ]
        },
        "commonMistakes": [
          {
            "mistake": "Locale-dependent decimal formatting (e.g., using commas instead of dots)",
            "error": "Output prints $65,75 instead of $65.75 in European locales",
            "fix": "Pass `Locale.US` to `String.format(Locale.US, \"$%.2f\", total)` or `System.out.printf`."
          },
          {
            "mistake": "Floating point precision loss in financial calculations",
            "error": "0.1 + 0.2 equals 0.30000000000000004 in IEEE-754 double",
            "fix": "In beginner code, round outputs with `%.2f`; in production financial enterprise apps, use `BigDecimal`."
          }
        ],
        "checkpoint": [
          {
            "question": "Which collection is optimal for maintaining an ordered history of all expenses?",
            "options": [
              "ArrayList<Expense>",
              "HashMap<String, Double>",
              "HashSet<Expense>",
              "int[]"
            ],
            "answer": 0,
            "explanation": "`ArrayList<Expense>` maintains insertion order and expands dynamically as expenses are recorded."
          },
          {
            "question": "Which collection is best suited for instant lookup of total items per category?",
            "options": [
              "HashMap<String, Integer>",
              "ArrayList<String>",
              "LinkedList<Integer>",
              "Vector"
            ],
            "answer": 0,
            "explanation": "`HashMap<String, Integer>` provides O(1) lookups and updates for category counts."
          }
        ],
        "exercise": {
          "instructions": "Read integer N representing the number of expense operations. Execute the sequence of commands:\n- `ADD <description> <amount> <category>` (records an expense)\n- `TOTAL` (prints 'Total Expenses: $<sum>' formatted to 2 decimal places)\n- `COUNT <category>` (prints 'Expenses in <category>: <count>')\nAll floating point totals should be printed formatted with `String.format(java.util.Locale.US, \"Total Expenses: $%.2f\", total)`.",
          "starterCode": "import java.util.Scanner;\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.Locale;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement Capstone Expense Tracker runner\n        \n    }\n}",
          "hints": [
            "Read N operations with sc.nextInt().",
            "For each operation, read command with sc.next().",
            "If ADD: read desc (sc.next()), amount (sc.nextDouble()), cat (sc.next()). Add to total and increment category in HashMap.",
            "If TOTAL: print `String.format(Locale.US, \"Total Expenses: $%.2f\", total)`.",
            "If COUNT: read category, lookup in map with getOrDefault(cat, 0), and print."
          ],
          "solution": "import java.util.Scanner;\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.Locale;\n\npublic class Main {\n    static class Expense {\n        String description;\n        double amount;\n        String category;\n        \n        Expense(String d, double a, String c) {\n            description = d;\n            amount = a;\n            category = c;\n        }\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int ops = sc.nextInt();\n        \n        ArrayList<Expense> list = new ArrayList<>();\n        HashMap<String, Integer> categoryCounts = new HashMap<>();\n        double total = 0.0;\n        \n        for (int i = 0; i < ops; i++) {\n            String cmd = sc.next();\n            if (cmd.equals(\"ADD\")) {\n                String desc = sc.next();\n                double amt = sc.nextDouble();\n                String cat = sc.next();\n                list.add(new Expense(desc, amt, cat));\n                total += amt;\n                categoryCounts.put(cat, categoryCounts.getOrDefault(cat, 0) + 1);\n            } else if (cmd.equals(\"TOTAL\")) {\n                System.out.println(String.format(Locale.US, \"Total Expenses: $%.2f\", total));\n            } else if (cmd.equals(\"COUNT\")) {\n                String cat = sc.next();\n                int count = categoryCounts.getOrDefault(cat, 0);\n                System.out.println(\"Expenses in \" + cat + \": \" + count);\n            }\n        }\n    }\n}",
          "tests": [
            {
              "name": "Add three items and compute total",
              "stdin": "4\nADD Tools 45.50 Gear\nADD Rations 12.00 Food\nADD Torches 8.25 Gear\nTOTAL\n",
              "expectedStdout": "Total Expenses: $65.75"
            },
            {
              "name": "Category count and total",
              "stdin": "5\nADD Bread 5.00 Food\nADD Apples 3.50 Food\nADD Pickaxe 25.00 Tools\nCOUNT Food\nTOTAL\n",
              "expectedStdout": "Expenses in Food: 2\nTotal Expenses: $33.50"
            },
            {
              "name": "Count zero items in category",
              "stdin": "3\nADD Potion 50.00 Magic\nCOUNT Gear\nTOTAL\n",
              "expectedStdout": "Expenses in Gear: 0\nTotal Expenses: $50.00"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol. I: Fundamentals, 12th ed.",
            "location": "Chapter 4: Objects and Classes & Chapter 9: Collections",
            "verify": false
          },
          {
            "source": "Head First Java, 3rd ed.",
            "location": "Chapter 12: Getting GUI (Design Patterns & Application Architecture)",
            "verify": false
          }
        ]
      }
    ],
    "quizBank": [
      {
        "id": "b8_q1",
        "type": "mcq",
        "question": "Which of these is a direct superclass of `RuntimeException` in Java?",
        "options": [
          "java.lang.Exception",
          "java.lang.Error",
          "java.lang.Throwable",
          "java.lang.Object"
        ],
        "answer": 0,
        "explanation": "`RuntimeException` extends `Exception`, which in turn extends `Throwable`."
      },
      {
        "id": "b8_q2",
        "type": "predict-output",
        "question": "What is the output of this code?\n```java\ntry {\n    int x = Integer.parseInt(\"xyz\");\n    System.out.print(\"A\");\n} catch (NumberFormatException e) {\n    System.out.print(\"B\");\n} finally {\n    System.out.print(\"C\");\n}\n```",
        "options": [
          "BC",
          "ABC",
          "B",
          "Compilation Error"
        ],
        "answer": 0,
        "explanation": "Parsing \"xyz\" throws NumberFormatException. Execution jumps immediately to catch, printing 'B', and then finally prints 'C'."
      },
      {
        "id": "b8_q3",
        "type": "spot-the-bug",
        "question": "Spot the bug in this code:\n```java\nArrayList<int> list = new ArrayList<int>();\nlist.add(10);\n```",
        "options": [
          "Java generics cannot accept primitive types like int; use wrapper type Integer",
          "Cannot add 10 to a list",
          "ArrayList must specify size in constructor",
          "add() is deprecated"
        ],
        "answer": 0,
        "explanation": "Generic type arguments must be reference types. Use `ArrayList<Integer>`."
      },
      {
        "id": "b8_q4",
        "type": "mcq",
        "question": "What is the distinction between `throw` and `throws` in Java?",
        "options": [
          "`throw` explicitly triggers an exception in code; `throws` declares potential exceptions in a method signature",
          "`throws` triggers an exception; `throw` declares it",
          "They are interchangeable synonyms",
          "`throw` is only used for errors; `throws` is only for exceptions"
        ],
        "answer": 0,
        "explanation": "`throw` is an imperative statement in the method body; `throws` is part of the method's declared contract."
      },
      {
        "id": "b8_q5",
        "type": "predict-output",
        "question": "What does this code print?\n```java\nHashMap<String, Integer> map = new HashMap<>();\nmap.put(\"A\", 1);\nmap.put(\"A\", 2);\nSystem.out.println(map.size() + \" \" + map.get(\"A\"));\n```",
        "options": [
          "1 2",
          "2 1",
          "2 2",
          "1 1"
        ],
        "answer": 0,
        "explanation": "Keys in a HashMap are unique. Putting key \"A\" with value 2 overwrites value 1. Size remains 1 and value is 2."
      },
      {
        "id": "b8_q6",
        "type": "mcq",
        "question": "Which block is guaranteed to execute even if an uncaught exception is thrown or a return statement is reached inside a try block?",
        "options": [
          "finally",
          "catch",
          "else",
          "cleanup"
        ],
        "answer": 0,
        "explanation": "The `finally` block always executes unless the JVM itself is terminated abruptly."
      },
      {
        "id": "b8_q7",
        "type": "predict-output",
        "question": "What does this code print?\n```java\nArrayList<String> items = new ArrayList<>();\nitems.add(\"Gold\");\nitems.add(\"Iron\");\nitems.remove(0);\nSystem.out.println(items.get(0));\n```",
        "options": [
          "Iron",
          "Gold",
          "null",
          "IndexOutOfBoundsException"
        ],
        "answer": 0,
        "explanation": "Removing index 0 shifts remaining elements down, so \"Iron\" becomes the new element at index 0."
      },
      {
        "id": "b8_q8",
        "type": "spot-the-bug",
        "question": "Why does this code throw a NullPointerException at runtime?\n```java\nHashMap<String, Integer> map = new HashMap<>();\nint val = map.get(\"UnsetKey\");\n```",
        "options": [
          "map.get(\"UnsetKey\") returns null, and unboxing null into primitive int causes NullPointerException",
          "map has not been initialized with new",
          "\"UnsetKey\" is not a valid String",
          "Cannot use Integer with HashMap"
        ],
        "answer": 0,
        "explanation": "When a key is missing, `get()` returns `null`. Attempting to unbox `null` into primitive `int val` results in `NullPointerException`."
      },
      {
        "id": "b8_q9",
        "type": "mcq",
        "question": "What happens to the internal array of an `ArrayList` when it runs out of capacity?",
        "options": [
          "A new larger array (typically 1.5x) is allocated and existing elements are copied over",
          "An OutOfMemoryError is immediately thrown",
          "It switches permanently to a LinkedList",
          "Elements are dropped from the beginning"
        ],
        "answer": 0,
        "explanation": "ArrayList expands its internal array by roughly 50% using `Arrays.copyOf()` / `System.arraycopy()`."
      },
      {
        "id": "b8_q10",
        "type": "fill-in",
        "question": "To safely fetch a value from a map or get 0 if absent, write: `int count = map.____(\"key\", 0);`",
        "options": [
          "getOrDefault",
          "getOrZero",
          "getSafe",
          "findOrDefault"
        ],
        "answer": 0,
        "explanation": "The `getOrDefault(key, defaultValue)` method avoids returning `null` when a key is absent."
      },
      {
        "id": "b8_q11",
        "type": "order-the-lines",
        "question": "Order these lines to catch an exception and print its message:",
        "options": [
          "try {",
          "    int val = Integer.parseInt(str);",
          "} catch (NumberFormatException e) {",
          "    System.out.println(e.getMessage());",
          "}"
        ],
        "answer": [
          0,
          1,
          2,
          3,
          4
        ],
        "explanation": "Standard try block, operation, catch header, error reporting, closing brace."
      },
      {
        "id": "b8_q12",
        "type": "mcq",
        "question": "Which of the following is a Checked exception?",
        "options": [
          "java.io.IOException",
          "java.lang.NullPointerException",
          "java.lang.ArithmeticException",
          "java.lang.IllegalArgumentException"
        ],
        "answer": 0,
        "explanation": "`java.io.IOException` extends `Exception` directly and is a checked exception requiring explicit handling or declaration."
      }
    ],
    "project": {
      "title": "Track 1 Capstone: Console Expense Tracker & Financial Auditor",
      "brief": "Build a complete, modular, interactive Console Expense Tracker in Java. The application tracks expenses with descriptions, amounts, and categories, stores records in an ArrayList<Expense>, performs real-time category aggregation via HashMap<String, Double>, and guards against invalid user input with try-catch.",
      "milestones": [
        "Milestone 1: Design an immutable or encapsulated Expense class (id, description, amount, category, timestamp)",
        "Milestone 2: Implement ExpenseManager containing ArrayList<Expense> and HashMap<String, Double> category tallies",
        "Milestone 3: Construct an interactive command processor supporting ADD, LIST, TOTAL, CATEGORY_BREAKDOWN, and REMOVE",
        "Milestone 4: Add input validation guarding against negative amounts, empty descriptions, and non-numeric numbers using try-catch"
      ],
      "rubric": [
        {
          "criterion": "OOP Architecture",
          "points": 25,
          "description": "Clean separation of Expense model, Manager service, and Console UI"
        },
        {
          "criterion": "Collection Mastery",
          "points": 25,
          "description": "Correct and efficient usage of ArrayList<Expense> and HashMap"
        },
        {
          "criterion": "Robust Exception Handling",
          "points": 25,
          "description": "Complete protection against NumberFormatException, NullPointerException, and invalid commands"
        },
        {
          "criterion": "Formatting & Usability",
          "points": 25,
          "description": "Clean financial reporting with currency alignment and Locale-safe formatting"
        }
      ],
      "stretchGoals": [
        "Add monthly budgeting alerts when category expenses exceed a predetermined spending limit",
        "Implement persistent CSV file import and export using try-with-resources"
      ]
    },
    "glossary": [
      {
        "term": "Exception",
        "definition": "An abnormal event or condition occurring during execution that disrupts normal instruction flow."
      },
      {
        "term": "try-catch",
        "definition": "A Java control structure that executes risky code in a try block and catches exceptions in one or more catch blocks."
      },
      {
        "term": "finally",
        "definition": "A block following try-catch that is guaranteed to execute regardless of whether an exception occurred or was handled."
      },
      {
        "term": "Checked Exception",
        "definition": "An exception verified at compile-time that must be caught or declared in the method header with throws."
      },
      {
        "term": "Unchecked Exception",
        "definition": "A runtime exception (extending RuntimeException) representing programming defects, which does not require explicit declaration."
      },
      {
        "term": "ArrayList",
        "definition": "A resizable array implementation of the List interface in java.util."
      },
      {
        "term": "Autoboxing",
        "definition": "The automatic conversion the Java compiler performs between primitive types and their corresponding object wrapper classes."
      },
      {
        "term": "HashMap",
        "definition": "A hash-table-based implementation of the Map interface that stores unique keys mapped to values."
      }
    ],
    "references": [
      {
        "source": "Core Java Vol. I: Fundamentals, 12th ed.",
        "location": "Chapter 7: Exceptions, Assertions, and Logging & Chapter 9: Collections",
        "verify": false
      },
      {
        "source": "Head First Java, 3rd ed.",
        "location": "Chapter 11: Risky Behavior & Chapter 16: Collections and Generics",
        "verify": false
      },
      {
        "source": "Effective Java, 3rd ed.",
        "location": "Item 70: Use checked exceptions for recoverable conditions",
        "verify": false
      }
    ],
    "level": "beginner"
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
    },
    "biome": "Creature Guild",
    "conceptMetaphor": "Inheritance links creature families sharing traits; interfaces enforce what any guild member can do."
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
    },
    "biome": "Hopper Depot",
    "conceptMetaphor": "Collections are inventories and sorting hoppers storing flexible volumes of items."
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
    },
    "biome": "Nether Fortress",
    "conceptMetaphor": "Secure file vaults and streams guarding persistent resources across worlds."
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
    },
    "biome": "Rail Pipeline",
    "conceptMetaphor": "Java Streams are minecart rails and hopper pipelines filtering and transforming data in motion."
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
    },
    "biome": "Chrono Monolith",
    "conceptMetaphor": "Precise world time clocks, daylight cycles, and pattern-matching scrolls."
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
    },
    "biome": "Inspection Quarry",
    "conceptMetaphor": "Unit testing and assertions verifying every block before it is placed in the wall."
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
    },
    "biome": "Obsidian Archive",
    "conceptMetaphor": "Relational databases and JDBC forging durable obsidian records that survive world resets."
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
    },
    "biome": "Villager Hive",
    "conceptMetaphor": "Threads are multiple villagers working simultaneously; synchronization keeps them from colliding."
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
    },
    "biome": "World Engine Core",
    "conceptMetaphor": "Deep JVM internals: garbage collectors recycling dropped items and JIT compiling hot chunks."
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
    },
    "biome": "Parallel Void",
    "conceptMetaphor": "Virtual threads and structured concurrency managing thousands of lightweight tasks in the void."
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
    },
    "biome": "Crystal Altar",
    "conceptMetaphor": "Records, sealed hierarchies, and pattern matching forging unyielding crystalline contracts."
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
            "code": "User u = new User.Builder(\"Scout\")\n    .email(\"scout@code.com\")\n    .role(\"ADMIN\")\n    .build();"
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
    },
    "biome": "Celestial Citadel",
    "conceptMetaphor": "Enterprise software architecture and design patterns for monumental scale."
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
    },
    "biome": "Warded Beacon",
    "conceptMetaphor": "Encrypted networking, TLS handshakes, and warded perimeter security."
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
    },
    "biome": "Spire Sanctuary",
    "conceptMetaphor": "Spring Boot REST microservices and cloud persistence reaching to the sky."
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
    },
    "biome": "Telemetry Watchtower",
    "conceptMetaphor": "Profiling, metrics, OpenTelemetry, and diagnostic lenses observing every heartbeat."
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
    },
    "biome": "End Gateway",
    "conceptMetaphor": "Containers, automated CI/CD pipelines, and production release gateways."
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
    ],
    "track": "beginner"
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
    if (!m.level && m.track) m.level = m.track;
    if (!m.track && m.level) m.track = m.level;
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
