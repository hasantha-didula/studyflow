// 
const SUPABASE_URL = 'https://xsxhyewzbvvglpuhecwf.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeGh5ZXd6YnZ2Z2xwdWhlY3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTM3OTQsImV4cCI6MjA4NjQ4OTc5NH0.xhu-PNHirwsxpj8H-XMWx1gVwdm2Zlhy3HbzB5Sj24I'; // Replace with your anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// Auth
document.getElementById('sign-up').addEventListener('click', () => {
    document.getElementById('auth-forms').innerHTML = `
        <form id="signup-form">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Sign Up</button>
        </form>
    `;
    document.getElementById('signup-form').addEventListener('submit', handleSignUp);
});

document.getElementById('sign-in').addEventListener('click', () => {
    document.getElementById('auth-forms').innerHTML = `
        <form id="signin-form">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Sign In</button>
        </form>
    `;
    document.getElementById('signin-form').addEventListener('submit', handleSignIn);
});

async function handleSignUp(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
        alert('Check your email for confirmation');
        document.getElementById('auth-forms').innerHTML = '';
    }
}

async function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
        currentUser = data.user;
        showApp();
    }
}

document.getElementById('sign-out').addEventListener('click', async () => {
    await supabase.auth.signOut();
    currentUser = null;
    document.getElementById('app').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
});

// Show app after auth
function showApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    loadSection('dashboard');
    setupNav();
}

// Nav setup
function setupNav() {
    document.querySelectorAll('nav button[data-section]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            loadSection(section);
        });
    });
}

// Load section
function loadSection(sectionName) {
    document.querySelectorAll('#main-content > section').forEach(s => s.classList.remove('active'));
    let section = document.getElementById(sectionName);
    if (!section) {
        section = createSection(sectionName);
        document.getElementById('main-content').appendChild(section);
    }
    section.classList.add('active');
}

// Create sections
function createSection(name) {
    const section = document.createElement('section');
    section.id = name;
    switch (name) {
        case 'classes':
            section.innerHTML = `
                <h2>Classes</h2>
                <form id="class-form">
                    <input type="text" id="class-name" placeholder="Class Name">
                    <input type="number" id="class-duration" placeholder="Duration (minutes)">
                    <input type="text" id="class-repeat" placeholder="Repeat (e.g., mon,wed,fri)">
                    <button type="submit">Add Class</button>
                </form>
                <ul id="classes-list"></ul>
            `;
            section.querySelector('#class-form').addEventListener('submit', handleAddClass);
            loadClasses();
            break;
        case 'subjects':
            section.innerHTML = `
                <h2>Subjects</h2>
                <form id="subject-form">
                    <input type="text" id="subject-name" placeholder="Subject Name">
                    <select id="subject-class"></select>
                    <button type="submit">Add Subject</button>
                </form>
                <ul id="subjects-list"></ul>
            `;
            section.querySelector('#subject-form').addEventListener('submit', handleAddSubject);
            loadSubjects();
            break;
        case 'exams':
            section.innerHTML = `
                <h2>Exams</h2>
                <form id="exam-form">
                    <select id="exam-subject"></select>
                    <input type="date" id="exam-date">
                    <input type="number" id="exam-duration" placeholder="Duration (minutes)">
                    <input type="number" id="exam-marks" placeholder="Total Marks">
                    <button type="submit">Add Exam</button>
                </form>
                <ul id="exams-list"></ul>
            `;
            section.querySelector('#exam-form').addEventListener('submit', handleAddExam);
            loadExams();
            break;
        case 'homeworks':
            section.innerHTML = `
                <h2>Homeworks</h2>
                <form id="hw-form">
                    <select id="hw-subject"></select>
                    <input type="text" id="hw-title" placeholder="Title">
                    <input type="date" id="hw-due" placeholder="Due Date">
                    <input type="number" id="hw-duration" placeholder="Duration (minutes)">
                    <input type="text" id="hw-repeat" placeholder="Repeat (e.g., weekly)">
                    <button type="submit">Add Homework</button>
                </form>
                <ul id="homeworks-list"></ul>
            `;
            section.querySelector('#hw-form').addEventListener('submit', handleAddHomework);
            loadHomeworks();
            break;
        case 'assignments':
            section.innerHTML = `
                <h2>Assignments</h2>
                <form id="ass-form">
                    <select id="ass-subject"></select>
                    <input type="text" id="ass-title" placeholder="Title">
                    <input type="date" id="ass-due" placeholder="Due Date">
                    <input type="number" id="ass-duration" placeholder="Duration (minutes)">
                    <input type="text" id="ass-repeat" placeholder="Repeat (e.g., weekly)">
                    <button type="submit">Add Assignment</button>
                </form>
                <ul id="assignments-list"></ul>
            `;
            section.querySelector('#ass-form').addEventListener('submit', handleAddAssignment);
            loadAssignments();
            break;
        case 'dashboard':
            section.innerHTML = `
                <h2>Dashboard</h2>
                <div id="graphs">
                    <canvas id="worked-time-chart"></canvas>
                    <canvas id="marks-chart"></canvas>
                    <canvas id="completions-chart"></canvas>
                </div>
            `;
            loadDashboard();
            break;
    }
    return section;
}

// CRUD Functions
async function handleAddClass(e) {
    e.preventDefault();
    const name = document.getElementById('class-name').value;
    const duration = parseInt(document.getElementById('class-duration').value);
    const repeat = document.getElementById('class-repeat').value;
    const { error } = await supabase.from('classes').insert([{ name, duration, repeat, user_id: currentUser.id }]);
    if (error) alert(error.message);
    else loadClasses();
}

async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('user_id', currentUser.id);
    const list = document.getElementById('classes-list');
    list.innerHTML = data.map(c => `<li>${c.name} - ${c.duration}min (${c.repeat}) <button onclick="deleteItem('classes', ${c.id})">Delete</button></li>`).join('');
}

async function handleAddSubject(e) {
    e.preventDefault();
    const name = document.getElementById('subject-name').value;
    const class_id = document.getElementById('subject-class').value;
    const { error } = await supabase.from('subjects').insert([{ name, class_id, user_id: currentUser.id }]);
    if (error) alert(error.message);
    else {
        loadSubjects();
        loadClassesForSubjects(); // Refresh select
    }
}

async function loadSubjects() {
    const { data } = await supabase.from('subjects').select('*').eq('user_id', currentUser.id);
    const list = document.getElementById('subjects-list');
    list.innerHTML = data.map(s => `<li>${s.name} <button onclick="deleteItem('subjects', ${s.id})">Delete</button></li>`).join('');
}

async function loadClassesForSubjects() {
    const { data: classes } = await supabase.from('classes').select('id, name').eq('user_id', currentUser.id);
    const select = document.getElementById('subject-class');
    select.innerHTML = classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function handleAddExam(e) {
    e.preventDefault();
    const subject_id = document.getElementById('exam-subject').value;
    const date = document.getElementById('exam-date').value;
    const duration = parseInt(document.getElementById('exam-duration').value);
    const marks = parseInt(document.getElementById('exam-marks').value);
    const { error } = await supabase.from('exams').insert([{ subject_id, date, duration, marks, user_id: currentUser.id }]);
    if (error) alert(error.message);
    else loadExams();
}

async function loadExams() {
    const { data } = await supabase.from('exams').select('*').eq('user_id', currentUser.id);
    const list = document.getElementById('exams-list');
    list.innerHTML = data.map(e => `<li>${e.date} - ${e.duration}min (${e.marks} marks) <button onclick="deleteItem('exams', ${e.id})">Delete</button></li>`).join('');
    loadSubjectsForExams();
}

async function loadSubjectsForExams() {
    const { data } = await supabase.from('subjects').select('id, name').eq('user_id', currentUser.id);
    const select = document.getElementById('exam-subject');
    select.innerHTML = data.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

async function handleAddHomework(e) {
    e.preventDefault();
    const subject_id = document.getElementById('hw-subject').value;
    const title = document.getElementById('hw-title').value;
    const due_date = document.getElementById('hw-due').value;
    const duration = parseInt(document.getElementById('hw-duration').value);
    const repeat = document.getElementById('hw-repeat').value;
    const { error } = await supabase.from('homeworks').insert([{ subject_id, title, due_date, duration, repeat, user_id: currentUser.id }]);
    if (error) alert(error.message);
    else loadHomeworks();
}

async function loadHomeworks() {
    const { data } = await supabase.from('homeworks').select('*').eq('user_id', currentUser.id);
    const list = document.getElementById('homeworks-list');
    list.innerHTML = data.map(h => `<li>${h.title} due ${h.due_date} - ${h.duration}min (${h.repeat}) <button onclick="deleteItem('homeworks', ${h.id})">Delete</button></li>`).join('');
    loadSubjectsForHW();
}

async function loadSubjectsForHW() {
    const { data } = await supabase.from('subjects').select('id, name').eq('user_id', currentUser.id);
    const select = document.getElementById('hw-subject');
    select.innerHTML = data.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

async function handleAddAssignment(e) {
    e.preventDefault();
    const subject_id = document.getElementById('ass-subject').value;
    const title = document.getElementById('ass-title').value;
    const due_date = document.getElementById('ass-due').value;
    const duration = parseInt(document.getElementById('ass-duration').value);
    const repeat = document.getElementById('ass-repeat').value;
    const { error } = await supabase.from('assignments').insert([{ subject_id, title, due_date, duration, repeat, user_id: currentUser.id }]);
    if (error) alert(error.message);
    else loadAssignments();
}

async function loadAssignments() {
    const { data } = await supabase.from('assignments').select('*').eq('user_id', currentUser.id);
    const list = document.getElementById('assignments-list');
    list.innerHTML = data.map(a => `<li>${a.title} due ${a.due_date} - ${a.duration}min (${a.repeat}) <button onclick="deleteItem('assignments', ${a.id})">Delete</button></li>`).join('');
    loadSubjectsForAss();
}

async function loadSubjectsForAss() {
    const { data } = await supabase.from('subjects').select('id, name').eq('user_id', currentUser.id);
    const select = document.getElementById('ass-subject');
    select.innerHTML = data.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

// Delete function
window.deleteItem = async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id).eq('user_id', currentUser.id);
    if (error) alert(error.message);
    else {
        // Reload current section
        const activeSection = document.querySelector('#main-content .active');
        if (activeSection) {
            const sectionName = activeSection.id;
            if (sectionName === 'classes') loadClasses();
            else if (sectionName === 'subjects') loadSubjects();
            else if (sectionName === 'exams') loadExams();
            else if (sectionName === 'homeworks') loadHomeworks();
            else if (sectionName === 'assignments') loadAssignments();
        }
    }
}

// Dashboard with Graphs
async function loadDashboard() {
    // Fetch data for graphs
    const { data: classData } = await supabase.from('class_sessions').select('time_spent').eq('user_id', currentUser.id).eq('completed', true);
    const totalWorkedTime = classData ? classData.reduce((sum, s) => sum + s.time_spent, 0) : 0;

    const { data: examData } = await supabase.from('exam_results').select('marks_obtained').eq('user_id', currentUser.id);
    const marks = examData ? examData.map(e => e.marks_obtained) : [];

    const { data: compData } = await supabase.from('task_completions').select('*').eq('user_id', currentUser.id).eq('completed', true);
    const completedCount = compData ? compData.length : 0;

    // Simple pie charts for demo (extend with more data as needed)
    const workedCtx = document.getElementById('worked-time-chart').getContext('2d');
    new Chart(workedCtx, {
        type: 'doughnut',
        data: {
            labels: ['Worked Time (min)'],
            datasets: [{ data: [totalWorkedTime], backgroundColor: ['#007bff'] }]
        }
    });

    const marksCtx = document.getElementById('marks-chart').getContext('2d');
    new Chart(marksCtx, {
        type: 'bar',
        data: {
            labels: marks.map((_, i) => `Exam ${i+1}`),
            datasets: [{ label: 'Marks', data: marks, backgroundColor: '#28a745' }]
        }
    });

    const compCtx = document.getElementById('completions-chart').getContext('2d');
    new Chart(compCtx, {
        type: 'pie',
        data: {
            labels: ['Completed Sessions'],
            datasets: [{ data: [completedCount], backgroundColor: ['#ffc107'] }]
        }
    });
}

// Initialize auth listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        showApp();
    }
});
