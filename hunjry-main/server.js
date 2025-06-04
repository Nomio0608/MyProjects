const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const apiDocs = require('./api-docs.json');
const db = require('./database.js');
const compression = require('compression');
const app = express();
let PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

let recipesData;
try {
    recipesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', 'recipes.json'), 'utf8'));
} catch (error) {
    console.error('Error reading recipes.json:', error);
    recipesData = { recipes: [] };
}

let ingredientsData;
try {
    ingredientsData = JSON.parse(fs.readFileSync('./json/ingredients.json'));
} catch (error) {
    console.error('Error reading ingredients.json:', error);
    ingredientsData = { ingredients: [] };
}

let userData = JSON.parse(fs.readFileSync('./json/user.json', 'utf-8'));

app.get('/api/recipes', (req, res) => {
    try {
        const recipesData = JSON.parse(fs.readFileSync('json/recipes.json', 'utf8'));
        res.json(recipesData);
    } catch (error) {
        console.error('Error reading recipes:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/ingredients', (req, res) => {
    res.json(ingredientsData);
});

app.get('/api/users', (req, res) => {
    res.json(userData);
});

app.post('/api/users', (req, res) => {
    const {Username, Password, likedfoods, Address, Phonenumber, Email } = req.body;
    try {
        const usersPath = path.join(__dirname, 'json', 'user.json');
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

        const newUser = {
            userId: userData.users.length > 0 ? Math.max(...userData.users.map(c => c.id)) + 1 : 1,
            username: Username,
            password: Password,
            likedFoods: likedfoods,
            address: Address,
            phonenumber: Phonenumber,
            email: Email
        }

        usersData.users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));
        res.json({ success: true, message: 'User added successfully' });
    } catch (error) {
        console.error("Error adding new user:", error);
        res.status(469).json({ success: false, message: 'Хэрэглэгч нэмэх үед алдаа гарлаа' });
    }
})

app.post('/api/comments', (req, res) => {
    const { recipeId, userId, body } = req.body;

    try {
        const recipesPath = path.join(__dirname, 'json', 'recipes.json');
        const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));

        const recipe = recipesData.recipes.find(r => r.id === recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Жор олдсонгүй' });
        }

        if (!recipe.comments) {
            recipe.comments = [];
        }

        const newComment = {
            id: recipe.comments.length > 0 ? Math.max(...recipe.comments.map(c => c.id)) + 1 : 1,
            body: body,
            userId: userId
        };

        recipe.comments.push(newComment);

        fs.writeFileSync(recipesPath, JSON.stringify(recipesData, null, 2));

        res.json({ success: true, comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: 'Сэтгэгдэл нэмэх үед алдаа гарлаа' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'htmls', 'login.html'));
});

app.get('/htmls/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, 'public', 'htmls', file));
});

app.post('/api/like-food', (req, res) => {
    const { userId, recipeId } = req.body;

    // Ensure that userData.users is properly loaded
    const user = userData.users.find(u => u.userId === userId);

    if (user) {
        if (!user.likedFoods) {
            user.likedFoods = [];
        }

        if (!user.likedFoods.includes(recipeId)) {
            user.likedFoods.push(recipeId);
            fs.writeFileSync('./json/user.json', JSON.stringify(userData, null, 2));

            res.json({ success: true, message: 'Food added to favorites' });
        } else {
            user.likedFoods = user.likedFoods.filter(id => id !== recipeId);
            fs.writeFileSync('./json/user.json', JSON.stringify(userData, null, 2));

            res.json({ success: true, message: 'Food removed from favorites' });
        }
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});
app.get('/api/user/:userId/liked-recipes', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = userData.users.find(u => u.userId === userId);

    if (user) {
        if (!user.likedFoods) {
            user.likedFoods = [];
        }

        const likedRecipes = user.likedFoods
            .map(recipeId =>
                recipesData.recipes.find(recipe => recipe.id === recipeId)
            )
            .filter(recipe => recipe !== undefined);

        res.json(likedRecipes);
    } else {
        res.json([]);
    }
});

app.post('/api/insert-ingredients', (req, res) => {
    const { ingredient, userId } = req.body;
    db.insertIngredient(ingredient, userId);
    res.json({ success: true, message: 'Ingredient added successfully' });
});

app.get('/api/add-comment', (req, res) => {
    try {
        const { userId, recipeId, comment, date } = req.body;

        const recipesData = JSON.parse(fs.readFileSync('json/recipes.json', 'utf8'));
        const usersData = JSON.parse(fs.readFileSync('json/user.json', 'utf8'));

        const user = usersData.users.find(u => u.userId === userId);

        const recipe = recipesData.recipes.find(r => r.id === recipeId);

        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        if (!recipe.comments) {
            recipe.comments = [];
        }

        recipe.comments.push({
            userId,
            userName: user ? user.name : 'Anonymous',
            comment,
            date
        });

        fs.writeFileSync('json/recipes.json', JSON.stringify(recipesData, null, 2));

        res.json({ success: true });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('*', (req, res) => {
    res.redirect('/htmls/login.html');
});

app.use(compression());

app.use(express.static('public', {
    maxAge: '1y',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        } else if (path.match(/\.(css|js|jpg|png|gif|ico)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// async function initializeDatabase() {
//     try {
//         await db.testConnection();
//         console.log('Database connected successfully');
//     } catch (error) {
//         console.error('Error initializing database:', error);
//     }
// }

// initializeDatabase();

const server = app.listen(PORT)
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
            PORT++;
            server.close();
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
    })
    .on('listening', () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
