const user = require('../DB/user');
const jwt = require('jsonwebtoken');
async function signUp(req, res) {
    try {
        let { email, password } = req.body;
        
        if (!email || !password) res.send('please fill the fields properly');
        else {
            let data = await user.findOne({ Email: email });
            if (data) {
                res.send('user already registered');
            } else {
                let User = new user({ Email: email, Password: password });
                User.save();
                res.status(200).send('user registered');
            }
        }
    } catch (err) {
        res.send(err)
    }
}



async function signIn(req, res) {
    try {
        let { email, password } = req.body;
        if (!email || !password) res.send('please fill the fields properly');
        else {
            let data = await user.findOne({ Email: email });
            if (data) {
                if (data.Password === password) {
                    let token = jwt.sign({ Email: email, Password: password }, process.env.SECRATE);
                    res.send({ message: "user logged in successfully", authToken: token, email: data.Email});
                } else {
                    res.send('password not correct');
                }
            }
        }
     } catch (err) {
        res.send(err);
    }
}

async function addList(req, res) {
    try {
        const {Id,Title,IsCompleted} = req.body;
        const token = req.headers['x-access-token'];
        const verify = jwt.verify(token, process.env.SECRATE);
        let email = verify.Email;
        let data = await user.findOne({ Email: email });
        data.ToDoList.push({id:Id,title: Title, isCompleted: IsCompleted });
        let list = data.ToDoList;
        const update = await user.updateOne(
            { Email: email },
            { $set: { ToDoList: list } }
        )
        if (update) {
            res.send('To Do List updated successfully');
        }
    } catch (err) {
        res.send(err);
    }
}

async function getList(req, res) {
    try {
        const { isCompleted } = req.query;
        const token = req.headers['x-access-token'];
        const verify = jwt.verify(token, process.env.SECRATE);
        if (verify) {
            if (typeof isCompleted != undefined) {
                let email = verify.Email;
                let data = await user.findOne({ Email: email, IsCompleted: isCompleted });
                res.send({ status: true, ToDoList: data.ToDoList });
            } else {
                let email = verify.Email;
                let data = await user.findOne({ Email: email});
                res.send({ status: true, ToDoList: data.ToDoList });
            }
        }
    } catch (err) {
        res.send(err);
    }
}

async function updateList(req, res) {
    try {
        const token = req.headers['x-access-token'];
        const { Id, Title, IsCompleted } = req.body;
        const verify = jwt.verify(token, process.env.SECRATE);
        if (verify) {
            let email = verify.Email;
            let data = await user.findOne({ Email: email });
            let list = data.ToDoList;
            console.log(list);
            for (let i = 0; i < list.length; i++){
                if (list[i].id === Id) {
                    list[i].title = Title;
                    list[i].isCompleted = IsCompleted;
                }
            }
            const update = await user.updateOne(
                { Email: email },
                { $set: { ToDoList: list } }
            )
            if (update) {
                res.send('To Do List updated successfully');
            }
        }
    } catch (err) {
        res.send(err);
    }
}
module.exports = {
    signUp,
    signIn,
    addList,
    getList,
    updateList
}
