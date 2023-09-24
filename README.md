# Morgan Stanley Codetogive
requirements:
github
nodejs
golang

libraries:
gin
react
axios

DEMO: 

registration/login: You can either login with Email and PW or through google authentication that I set up with Firebase.

![login](https://user-images.githubusercontent.com/55557666/169363487-71ecc74a-b5b7-4336-a458-f583f4a3ca5e.gif)

Different roles of Mod, Client, Volunteer

Being a mod allows you to add,delete events that gets stored/removed from MongoDB. In the following GIF, you can see me creating a demo event with 123 as its values.

![mod](https://user-images.githubusercontent.com/55557666/169363751-cc46ce2b-7374-4346-964b-adb37d5886c9.gif)

Being a Volunteer or Client allows you to sign up for events and once you have gained 100 points, you level up!
In the following Gif, you can see me sign up for the demo event I created earlier and since it's 123 points, it will level me up and surprise!!

![levelup](https://user-images.githubusercontent.com/55557666/169364091-332fdd2e-c99d-463e-ae1c-16faa5d0941c.gif)



instructions to run it on your local host:

pull github repo,

have two command lines: one in the directory of "./codetogive"
                        the other in the directory of "./server"
                        
in the codetogive command prompts, run by typing "npm start"
in the server command prompt, run by typing "go run main.go"

goto http://localhost:3000/

and enjoy
                        
