const TRACK2_MODULES = [
  {
    "id": "i1",
    "code": "I1",
    "level": "intermediate",
    "title": "Inheritance, Interfaces & Polymorphism",
    "subtitle": "Mob families, abstract classes, default methods, and dynamic dispatch",
    "biome": "Nether Wastes",
    "estimatedMinutes": 110,
    "learningObjectives": [
      "Design clean class hierarchies using extends",
      "Define contracts using interface",
      "Utilize polymorphism and override @Override methods"
    ],
    "prerequisites": [
      "b7"
    ],
    "lessons": [
      {
        "id": "i1_l1",
        "title": "Inheritance & Method Overriding",
        "xp": 35,
        "estimatedMinutes": 18,
        "story": "In the Nether, mobs share common survival traits. Zombie Piglins and standard zombies derive from a common ancestor hierarchy.",
        "slides": [
          {
            "title": "The extends Keyword",
            "type": "code",
            "content": "Subclasses inherit state and behavior from a superclass using `extends`.",
            "code": "class Entity {\n    protected String name;\n    public Entity(String name) { this.name = name; }\n    public void act() { System.out.println(name + \" spawns.\"); }\n}\n\nclass Blaze extends Entity {\n    public Blaze() { super(\"Blaze\"); }\n    @Override\n    public void act() { System.out.println(name + \" shoots fireballs!\"); }\n}"
          }
        ],
        "underTheHood": "The JVM implements dynamic method dispatch using Virtual Method Tables (vtable). Invocations are translated to invokevirtual bytecode.",
        "commonMistakes": [
          {
            "mistake": "Forgetting super() constructor call",
            "error": "Implicit super constructor is undefined",
            "fix": "Call super(args) on the first line of the subclass constructor."
          }
        ],
        "checkpoint": [
          {
            "question": "What annotation ensures a method properly overrides a superclass method?",
            "options": [
              "@Inherit",
              "@Override",
              "@Super",
              "@Virtual"
            ],
            "answer": 1
          }
        ],
        "exercise": {
          "instructions": "Define an `Animal` superclass with `speak()` printing `Noise`. Define `Dog extends Animal` overriding `speak()` to print `Woof`. In main, call `new Dog().speak()`.",
          "starterCode": "class Animal {\n    public void speak() { System.out.println(\"Noise\"); }\n}\n// TODO: Dog subclass\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Call speak\n    }\n}",
          "hints": [
            "class Dog extends Animal { @Override public void speak() { System.out.println(\"Woof\"); } }",
            "new Dog().speak();"
          ],
          "solution": "class Animal {\n    public void speak() { System.out.println(\"Noise\"); }\n}\nclass Dog extends Animal {\n    @Override\n    public void speak() { System.out.println(\"Woof\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        new Dog().speak();\n    }\n}",
          "tests": [
            {
              "name": "Dog woofs",
              "stdin": "",
              "expected": "Woof"
            }
          ]
        },
        "references": [
          {
            "source": "Core Java Vol I, 12th ed.",
            "location": "Chapter 5: Inheritance",
            "verify": false
          }
        ]
      }
    ]
  },
  {
    "id": "i2",
    "code": "I2",
    "level": "intermediate",
    "title": "Collections & Generics in Depth",
    "subtitle": "List, Set, Map, type erasure, wildcards, and algorithmic complexity",
    "biome": "Basalt Deltas",
    "estimatedMinutes": 110,
    "learningObjectives": [
      "Choose the optimal collection (ArrayList, HashSet, TreeMap, ArrayDeque)",
      "Use generics with bounded wildcards (? extends / ? super)",
      "Evaluate O(1) vs O(log n) vs O(n) access patterns"
    ],
    "prerequisites": [
      "i1"
    ]
  },
  {
    "id": "i3",
    "code": "I3",
    "level": "intermediate",
    "title": "Files, I/O & try-with-resources",
    "subtitle": "java.nio.file, Path, Files, BufferedReader, and AutoCloseable",
    "biome": "Crimson Forest",
    "estimatedMinutes": 100,
    "learningObjectives": [
      "Read and write files safely with java.nio.file.Files",
      "Prevent resource leaks with try-with-resources",
      "Parse structured file streams"
    ],
    "prerequisites": [
      "i2"
    ]
  },
  {
    "id": "i4",
    "code": "I4",
    "level": "intermediate",
    "title": "Lambdas, Streams & Optional",
    "subtitle": "Functional interfaces, map, filter, reduce, collectors, and null safety",
    "biome": "Warped Forest",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Write concise lambda expressions and method references",
      "Build functional data processing pipelines with Stream API",
      "Eliminate NullPointerExceptions using java.util.Optional"
    ],
    "prerequisites": [
      "i3"
    ]
  },
  {
    "id": "i5",
    "code": "I5",
    "level": "intermediate",
    "title": "Records, Enums, Sealed Types & Pattern Matching",
    "subtitle": "Modern Java 16-21 data-oriented programming paradigms",
    "biome": "Soul Sand Valley",
    "estimatedMinutes": 115,
    "learningObjectives": [
      "Define immutable data carriers using record",
      "Model closed domain types using sealed interfaces",
      "Use pattern matching for switch and instanceof"
    ],
    "prerequisites": [
      "i4"
    ]
  },
  {
    "id": "i6",
    "code": "I6",
    "level": "intermediate",
    "title": "Testing with JUnit 5 & Debugging",
    "subtitle": "Assertions, parameterized tests, test-driven development, and IDE breakpoints",
    "biome": "Nether Fortress",
    "estimatedMinutes": 100,
    "learningObjectives": [
      "Write robust unit tests with @Test, assertEqual, and assertThrows",
      "Structure test suites using Arrange-Act-Assert (AAA)",
      "Isolate defects with deterministic debugging"
    ],
    "prerequisites": [
      "i5"
    ]
  },
  {
    "id": "i7",
    "code": "I7",
    "level": "intermediate",
    "title": "JDBC & SQL Essentials",
    "subtitle": "Relational data persistence, PreparedStatement, SQL queries, and transactions",
    "biome": "Piglin Bastion",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Connect to databases using JDBC DriverManager and Connection pools",
      "Prevent SQL injection using PreparedStatement",
      "Execute CRUD operations and manage transactions (commit/rollback)"
    ],
    "prerequisites": [
      "i6"
    ]
  },
  {
    "id": "i8",
    "code": "I8",
    "level": "intermediate",
    "title": "Concurrency Basics & Threads",
    "subtitle": "Thread, Runnable, synchronized, race conditions, and thread safety",
    "biome": "Nether Core",
    "estimatedMinutes": 125,
    "learningObjectives": [
      "Spawn concurrent worker threads using Runnable",
      "Identify and prevent data race conditions",
      "Synchronize critical sections with intrinsic locks"
    ],
    "prerequisites": [
      "i7"
    ]
  }
];
if (typeof module !== "undefined") module.exports = { TRACK2_MODULES };
