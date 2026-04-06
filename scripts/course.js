const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
        technology: ["Python"],
        completed: false,
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
        technology: ["HTML", "CSS"],
        completed: true,
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
        technology: ["Python"],
        completed: false,
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
        technology: ["C#"],
        completed: true,
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: true,
    },
    {
        subject: "WDD",
        number: 231,
        title: "Frontend Web Development I",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: false,
    },
];

const coursesGrid = document.getElementById("courses-grid");
const creditCounter = document.getElementById("credit-counter");
const allBtn = document.getElementById("all-btn");
const wddBtn = document.getElementById("wdd-btn");
const cseBtn = document.getElementById("cse-btn");

function renderCourses(coursesToRender) {
    coursesGrid.innerHTML = "";

    // Add courses to the grid
    coursesToRender.forEach((course) => {
        const courseCard = document.createElement("div");
        courseCard.className = `course-card ${course.completed ? "completed" : ""}`;
        courseCard.style.position = "relative";

        courseCard.innerHTML =
            '<div class="course-header">' +
            '<div class="course-subject-number">' +
            course.subject +
            " " +
            course.number +
            "</div>" +
            '<div class="course-credits">' +
            course.credits +
            " Credits</div>" +
            "</div>" +
            '<div class="course-content">' +
            '<h3 class="course-title">' +
            course.title +
            "</h3>" +
            '<p class="course-desc">' +
            course.description +
            "</p>" +
            '<div class="course-tech">' +
            course.technology
                .map((tech) => '<span class="tech-badge">' + tech + "</span>")
                .join("") +
            "</div>" +
            (course.completed ? '<div class="completed-badge">COMPLETED</div>' : "") +
            "</div>";

        coursesGrid.appendChild(courseCard);
    });

    const totalCredits = coursesToRender.reduce(
        (total, course) => total + course.credits,
        0
    );
    creditCounter.textContent = `Total credits: ${totalCredits}`;
}

function showAllCourses() {
    setActiveButton(allBtn);
    renderCourses(courses);
}

function showWDDCourses() {
    setActiveButton(wddBtn);
    const wddCourses = courses.filter((course) => course.subject === "WDD");
    renderCourses(wddCourses);
}

function showCSECourses() {
    setActiveButton(cseBtn);
    const cseCourses = courses.filter((course) => course.subject === "CSE");
    renderCourses(cseCourses);
}

function setActiveButton(button) {
    allBtn.classList.remove("active");
    wddBtn.classList.remove("active");
    cseBtn.classList.remove("active");
    button.classList.add("active");
}

allBtn.addEventListener("click", showAllCourses);
wddBtn.addEventListener("click", showWDDCourses);
cseBtn.addEventListener("click", showCSECourses);

showAllCourses();
