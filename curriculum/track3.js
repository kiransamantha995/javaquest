const TRACK3_MODULES = [
  {
    "id": "a1",
    "code": "A1",
    "level": "advanced",
    "title": "JVM Memory, Class Loading & GC Internals",
    "subtitle": "Metaspace, Heap generations, GC algorithms (G1, ZGC), and memory tuning",
    "biome": "End Gateway",
    "estimatedMinutes": 130,
    "learningObjectives": [
      "Inspect JVM memory layout (Young/Old gen, TLAB, Metaspace)",
      "Compare Garbage Collectors (Serial, Parallel, G1, ZGC)",
      "Analyze GC logs and diagnose OutOfMemoryError"
    ],
    "prerequisites": [
      "i8"
    ]
  },
  {
    "id": "a2",
    "code": "A2",
    "level": "advanced",
    "title": "Java Memory Model & Advanced Concurrency",
    "subtitle": "volatile, happens-before consistency, Atomic variables, and CAS",
    "biome": "End Barrens",
    "estimatedMinutes": 130,
    "learningObjectives": [
      "Explain JMM happens-before guarantees and memory barriers",
      "Apply lock-free synchronization using java.util.concurrent.atomic",
      "Implement concurrent data pipelines with ConcurrentHashMap and BlockingQueue"
    ],
    "prerequisites": [
      "a1"
    ]
  },
  {
    "id": "a3",
    "code": "A3",
    "level": "advanced",
    "title": "Virtual Threads & Structured Concurrency",
    "subtitle": "Java 21 Project Loom, carrier threads, and scalable server architectures",
    "biome": "Chorus Forest",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Create lightweight Virtual Threads with Executors.newVirtualThreadPerTaskExecutor",
      "Understand thread unmounting during blocking I/O",
      "Coordinate concurrent subtasks using StructuredTaskScope"
    ],
    "prerequisites": [
      "a2"
    ]
  },
  {
    "id": "a4",
    "code": "A4",
    "level": "advanced",
    "title": "Design Patterns & Enterprise Architecture",
    "subtitle": "Factory, Builder, Singleton, Strategy, Observer, and SOLID principles",
    "biome": "End Ship",
    "estimatedMinutes": 120,
    "learningObjectives": [
      "Apply SOLID design principles in production systems",
      "Implement Gang of Four design patterns idiomatically in modern Java",
      "Refactor rigid legacy code into decoupled components"
    ],
    "prerequisites": [
      "a3"
    ]
  },
  {
    "id": "a5",
    "code": "A5",
    "level": "advanced",
    "title": "Networking, HTTP & Security Engineering",
    "subtitle": "java.net.http.HttpClient, REST client consumption, TLS, and OWASP defenses",
    "biome": "Void Abyss",
    "estimatedMinutes": 125,
    "learningObjectives": [
      "Issue async HTTP requests using modern HttpClient",
      "Implement TLS validation and secure credential storage",
      "Mitigate OWASP Top 10 vulnerabilities (Injection, deserialization, auth)"
    ],
    "prerequisites": [
      "a4"
    ]
  },
  {
    "id": "a6",
    "code": "A6",
    "level": "advanced",
    "title": "Spring Boot, REST APIs & JPA",
    "subtitle": "Inversion of Control, Dependency Injection, @RestController, and Spring Data",
    "biome": "End City",
    "estimatedMinutes": 140,
    "learningObjectives": [
      "Scaffold and launch production microservices with Spring Boot",
      "Build RESTful APIs with input validation and exception handlers",
      "Map database entities using Hibernate and Spring Data JPA"
    ],
    "prerequisites": [
      "a5"
    ]
  },
  {
    "id": "a7",
    "code": "A7",
    "level": "advanced",
    "title": "High Performance, Profiling & JFR",
    "subtitle": "Java Flight Recorder, JDK Mission Control, JMH benchmarking, and memory leaks",
    "biome": "Ender Dragon Roost",
    "estimatedMinutes": 130,
    "learningObjectives": [
      "Profile CPU and memory allocation with Java Flight Recorder (JFR)",
      "Conduct scientifically valid microbenchmarks with JMH",
      "Pinpoint and eliminate object allocation hotspots"
    ],
    "prerequisites": [
      "a6"
    ]
  },
  {
    "id": "a8",
    "code": "A8",
    "level": "advanced",
    "title": "Cloud Packaging, Docker & CI/CD Pipelines",
    "subtitle": "Containerization, GraalVM native images, GitHub Actions, and production deployments",
    "biome": "End Fountain",
    "estimatedMinutes": 130,
    "learningObjectives": [
      "Containerize Java applications with multi-stage Dockerfiles",
      "Compile Ahead-of-Time (AOT) native binaries with GraalVM",
      "Automate test, build, and deploy workflows using CI/CD pipelines"
    ],
    "prerequisites": [
      "a7"
    ]
  }
];
if (typeof module !== "undefined") module.exports = { TRACK3_MODULES };
