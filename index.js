const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let habits = ["Drink water", "Excercise", "Read a book"];

let habitCompletions = {};

app.get('/habits', (req, res) => {
    res.json({habits});
});

app.post('/habits', (req, res) => {
    const {name} = req.body;
    if (!name) {
        return res.status(400).json({error: "Habit name is required."});
    }
    habits.push(name);
    res.json({message: "Habit added successfully", habits });
});

app.post('/habits/complete', (req,res) => {
    const { date, habit } = req.body;
    if (!habit || !date) {
        return res.status(400).json({error: "Missing date or habit" });
    }
    if (!habitCompletions[date]) {
        habitCompletions[date] = [];
    } 
    habitCompletions[date].push(habit);
    res.json({message: "Habit marked as complete."});
});




app.post('/habits', (req, res) => {
    const { habit } = req.body;
    if (habit) {
        habits.push(habit);
        res.status(201).json({ message: "Habit added." });
    } else {
      res.status(400).json({ error: "Missing habit text."});
    }
});

app.post('/habits/complete', (req,res) => {
    const { date, habit } = req.body;
    if (!habit || !date) {
        return res.status(400).json({error: "Missing date or habit" });
    }
    if (!habitCompletions[date]) {
        habitCompletions[date] = [];
    } 
    habitCompletions[date].push(habit);
    res.json({message: "Habit marked as complete."});
});

app.post('/habits/uncomplete', (req, res) => {
    const { date, habit } = req.body;
    if (!habit || !date) {
        return res.status(400).json({error: "Missing date or habit" });
    }
    if (!habitCompletions[date]) {
        return res.status(404).json({ error: "No completions found for this date" });
    }
    habitCompletions[date] = habitCompletions[date].filter(h => h !== habit);
    res.json({message: "Habit unmarked as complete." });
});

app.get('/habits/completed/:date', (req,res) => {
    const date = req.params.date;
    const completed = habitCompletions[date] ||[];
    res.json({completed});
});

app.delete('/habits/:habit', (req, res) => {
    const habitToDelete = req.params.habit;
    const index = habits.findIndex(h => h.toLowerCase() === habitToDelete.toLowerCase());
    if (index!== -1) {
        habits.splice(index,1);
        res.json({message: 'Habit deleted'});
    } else {
        res.status(404).json({error: 'Habit not found'});
    }
});

app.put('/habits/:oldHabit', (req, res) => {
    const oldHabit = req.params.oldHabit;
    const { newHabit } = req.body;
    const index = habits.findIndex(h => h.toLowerCase() === oldHabit.toLowerCase());
    if (index !== -1 && newHabit) {
        habits[index] = newHabit;
        res.json({ message: 'Habit updated'});
    } else {
        res.status(404).json({ error: 'Habit not found or new habit missing'});
    }
});
app.get('/habits/count', (req, res) => {
    res.json({ count: habits.length });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});