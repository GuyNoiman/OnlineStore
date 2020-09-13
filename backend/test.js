const fetch = require('node-fetch');
const chalk = require('chalk');

const url = "http://localhost:3000";
const ok = chalk.green("PASSED");
const failure = chalk.red("FAILED");

async function test(){
    try {
        //Test cart functionalities
        console.log("------Test cart------")
        var body = { email: "admin"}
        let res = await fetch('http://localhost:3000/cart', {
          method : "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        let ans = await res.text()
        status = ans !== "FAIL" ? ok : failure
        console.log(`Test login -  expected: cart dict found: ${ans} - ${status}`)
        
        console.log("------Test cart------")
        body = { email: "thisisinotarealemailnoway"}
        res = await fetch('http://localhost:3000/cart', {
          method : "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        ans = await res.text()
        status = ans === "cart user NOT EXIST" ? ok : failure
        console.log(`Test login -  expected: "cart user NOT EXIST" found: ${ans} - ` + status)
        
        //Test auth functionalities
        body = { cookieUid: "123" }
        console.log("------Test Auth------")
        res = await fetch('http://localhost:3000/auth', {
        method : "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
        })
        ans = await res.text()
        status = ans === "false" ? ok : failure
        console.log(`Test login -  expected: false found: ${ans} - ` + status)

        //Test login functionalities
        console.log("------Test Login------")
        body = { email: "notexistsuser", password: "123" }
        res = await fetch('http://localhost:3000/login', {
        method : "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
        })
        ans = await res.text()
        status = ans === "NOT EXIST" ? ok : failure
        console.log(`Test login -  expected: NOT EXIST found: ${ans} - ` + status)

      } catch(err) {
        console.log(`Encountered error while running tests: ${err}`)
      }
    }
    test()