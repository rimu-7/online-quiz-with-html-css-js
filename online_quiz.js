var lst = ["General Knowledge", "Books", "Film", "Music", "Musicals & Theatres", "Television", "Video Games", "Board Games", "Science & Nature",
    "Computers", "Mathematics", "Mythology", "Sports", "Geography", "History", "Politics", "Art",
    "Celebrities", "Animals", "Vehicles", "Comics", "Gadgets", "Japanese anime & Manga", "Cartoon & Animation"];
var x;
for (x of lst) {
    var option = document.createElement("OPTION"); // Create a <option>
    var att = document.createAttribute("value");
    att.value = x.toLowerCase();
    option.innerHTML = x;
    document.getElementById("tr").appendChild(option);
}

function Validate() {
    var flag = true;
    // get difficulty value
    var d = document.getElementById("difficulty").value;
    // get topic selected
    var e = document.getElementById("tr");
    var t = e.options[e.selectedIndex].value;
    // get question amount
    var q = document.getElementById("q-amount").value;
    // check for empty input and if guidelines followed
    if (d == "" || t == "" || q == "") {
        alert("All info must be filled out");
        flag = false;
    } else if (q == 0 || q > 50) {
        alert("Please input manageble values");
        flag = false;
    }
    if (flag) {
        var questions = [];
        var correct = [];
        var incorrect = [];
        var url = "https://opentdb.com/api.php?amount=" + q + "&category=" + lst.indexOf(t) + "&difficulty=" + d;
        fetch(url).then((response) => { return response.json(); }).then((obj) => {
            console.log(obj);
            obj["results"].forEach(element => {
                questions.push(element["question"]);
                correct.push(element["correct_answer"]);
                incorrect.push(element["incorrect_answers"]);
            })
            ReadDisplay(questions, correct, incorrect);
        }).catch(function (error) {
            console.log("Something went wrong");
            console.log(error);
        });


    }
}

function ReadDisplay(questions, correct, incorrect) {
    var counter = 0;
    var view = "s-view";
    var h;
    // Remove the elements for s-view
    deleteChild();
    // Add answer choice
    for (item of incorrect) {
        item.push(correct[incorrect.indexOf(item)]);
        item.sort(function () { return 0.5 - Math.random(); })
    }
    // Loop through questions and display all of them
    var number = 1;
    for (q of questions) {
        if (view != "s-view") {
            var new_view = document.createElement("div");
            var new_attr = document.createAttribute("id");
            var new_attr_class = document.createAttribute("class");
            var new_attr_style = document.createAttribute("style");
            new_attr.value = view;
            new_attr_class.value = "s-view";
            h = (300 + 20) * counter + 20;
            new_attr_style.value = "top: " + h.toString() + "px; height: 300px;";
            new_view.setAttributeNode(new_attr_style);
            new_view.setAttributeNode(new_attr);
            new_view.setAttributeNode(new_attr_class);
            document.body.appendChild(new_view);
        }
        // Add question
        var add_q = document.createElement("H2");
        add_q.innerHTML = "#" + number.toString() + " " + q;
        var attr_q = document.createAttribute("style");
        attr_q.value = "font-weight: bold; margin: 40px;";
        add_q.setAttributeNode(attr_q);
        document.getElementById(view).appendChild(add_q);

        for (answer of incorrect[counter]) {
            var div = document.createElement("div");
            var add_a = document.createElement("INPUT");
            var label = document.createElement("label");
            label.innerHTML = answer;
            var attr_a_type = document.createAttribute("type");
            var attr_a_name = document.createAttribute("name");
            var attr_a_id = document.createAttribute("id");
            var attr_a_value = document.createAttribute("value");
            var attr_a_style = document.createAttribute("style");
            attr_a_name.value = "choices" + counter.toString();
            attr_a_value.value = answer;
            attr_a_type.value = "radio";
            attr_a_style.value = "font-weight: bold; font-size: 1.5em; margin-bottom: 10px;";
            add_a.setAttributeNode(attr_a_name);
            add_a.setAttributeNode(attr_a_value);
            add_a.setAttributeNode(attr_a_type);
            add_a.setAttributeNode(attr_a_style);
            document.getElementById(view).appendChild(div).appendChild(label).appendChild(add_a);
        }

        counter++;
        number++;
        if (counter == 1) {
            view += counter.toString();
        } else {
            view = view.replace(view[view.length - 1], counter.toString());
        }
    }
    // Create a submit button
    var checkbtn = document.createElement("BUTTON");
    checkbtn.innerHTML = "Submit";
    var checkbtn_id = document.createAttribute("id");
    var checkbtn_style = document.createAttribute("style");
    var checkbtn_value = document.createAttribute("value");
    var nh = h + 320;
    checkbtn_style.value = "position: absolute; top: " + nh.toString() + "px; left: calc(50% - 60px);";
    checkbtn_id.value = "checbutton";
    checkbtn_value.value = "check";
    checkbtn.setAttributeNode(checkbtn_id);
    checkbtn.setAttributeNode(checkbtn_style);
    checkbtn.setAttributeNode(checkbtn_value);
    document.body.appendChild(checkbtn);

    // Wait for button click
    checkbtn.addEventListener('click', function () {
        // Hide button
        $("#checbutton").hide();

        // Store info to display later
        var infolist = [];
        var tally = 0;
        for (i = 0; i < correct.length; i++) {
            var name = "choices" + i.toString();
            var radios = document.getElementsByName(name);
            for (w = 0; w < radios.length; w++) {
                if (radios[w].checked && correct[i] == radios[w].value) {
                    tally++;
                } else if (radios[w].checked && correct[i] != radios[w].value) {
                    infolist.push(questions.indexOf(questions[i]));
                }
            }
        }

        // Calculate Grade
        var frac = tally / questions.length;
        var grade = Math.round(frac * 100);
        var content;
        if (grade >= 80) {
            content = "Congradulations, you recieved " + grade.toString() + "%"
        } else { content = "You got " + grade.toString() + "%. Better Luck Next Time!" }

        // Display Grade & wrong questions
        var pcontent = document.createElement("p");
        pcontent.innerHTML = content;
        document.getElementById("results").appendChild(pcontent);

        if (grade != 100) {
            var ulcontent = document.createElement("ul");
            document.getElementById("results").appendChild(ulcontent);
            for (item of infolist) {
                item += 1;
                var licontent = document.createElement("li");
                var index = item - 1;
                licontent.innerHTML = "#" + item.toString() + " - Correct Answer: " + correct[index];
                ulcontent.appendChild(licontent);
            }
        }
        $(function () {
            $("#results").dialog({
                resizable: true,
                classes: {
                    "ui-dialog": "result-all",
                    "ui-dialog-titlebar": "result-titlebar",
                    "ui-dialog-content": "result-content"
                }
            });
        });
    });
}

function deleteChild() {
    var e = document.getElementById("s-view");
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    // Remove the height and move up to the top
    var sstyle = document.createAttribute("style");
    sstyle.value = "height: 300px; top: 20px;";
    e.setAttributeNode(sstyle);
}