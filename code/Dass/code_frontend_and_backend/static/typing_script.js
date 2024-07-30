var email;
var type;

function replaceSingleQuotes(inputString) {
    let replacedString = inputString.replace(/\[(.*?)'/, '["$1"'); // Replace after '['
    replacedString = replacedString.replace(/,(.*?)'/, ',"$1"'); // Replace after ','
    replacedString = replacedString.replace(/'(.*?),/, '"$1",'); // Replace before ','
    replacedString = replacedString.replace(/'(.*?)'\]/, '"$1"]'); // Replace before ']'
    return replacedString;
}

document.addEventListener("DOMContentLoaded", function () {
    var resultData;
    $.ajax({
        type: "GET",
        url: window.location.href + "datapost",
        dataType: "json",
        success: function (response) {
            console.log("helli");
            resultData = response;
            console.log(resultData);
            var linksArray = resultData["links"];
            console.log(linksArray);
            var messageheadArray = resultData["messageheadings"];
            var questionArray = resultData["question"];
            var messageArray = resultData["message"];
            email = resultData["email"];
            type = resultData["type"];
            console.log(email);
            console.log(type);

            var list = document.getElementById("recent-searches-list");
            var chatMessages = document.getElementById("chatMessages");
            console.log(list);
            var currentPageUrl = window.location.href;
            var secondLastSlashIndex = currentPageUrl.lastIndexOf('/', currentPageUrl.lastIndexOf('/') - 1);

            var modifiedUrl = currentPageUrl.substring(0, secondLastSlashIndex);
            console.log(questionArray)
            console.log(messageArray)
            for (var i = 0; i < linksArray.length; i++) {
                var listItem = document.createElement("li");
                listItem.className = "list-group-item"
                var linkElement = document.createElement("a");
                linkElement.href = modifiedUrl + "/" + linksArray[i];
                linkElement.innerHTML = messageheadArray[i];
                linkElement.style.color = "white";
                linkElement.style.textDecoration = "none";
                linkElement.addEventListener('mouseover', function () {
                    this.style.color = "gray";
                });
                linkElement.addEventListener('mouseout', function () {
                    this.style.color = "white";
                });
                linkElement.style.cursor = "pointer";
                listItem.style.paddingBottom = "7px";
                listItem.appendChild(linkElement);
                list.appendChild(listItem);
                list.style.color = "white";
                console.log("hetre")

            }
            var min_length = Math.min(questionArray.length, messageArray.length);
            for (var i = 0; i < min_length; i++) {
                console.log("hetre")
                var userMessage = document.createElement("div");
                userMessage.className = "message user-message";
                userMessage.textContent = questionArray[i];
                var botMessage = document.createElement("div");
                botMessage.className = "message bot-message";
                var ind = 0
                var bold = false; // flag to track if text should be bold
                var boldText = ''; // to store characters for bold text
                var messageInstance = messageArray[i];

                while (ind < messageInstance.length) {
                    var char = messageInstance[ind];
                    if (messageInstance.substring(ind, ind + 3) === "<b>") {
                        // console.log("bold me");
                        bold = true; // set bold flag to true
                        ind += 3; // skip "<b>"
                        // return; // move to the next character without typing
                        continue;
                    }
                    if (messageInstance.substring(ind, ind + 4) === "</b>") {
                        bold = false; // set bold flag to false
                        ind += 4; // skip "</b>"
                        // console.log(boldText);
                        botMessage.innerHTML += "<b>" + boldText + "</b>"; // append bold text
                        boldText = ''; // reset bold text
                        // return; // move to the next character without typing
                        continue;
                    }
                    if (messageInstance.substring(ind, ind + 4) === "<br>") {
                        botMessage.innerHTML += "<br>" // insert <br> tag for newline
                        ind += 4; // move to the next character
                        // return; // move to the next character without typing
                        continue;
                    }
                    if (bold) {
                        boldText += char; // accumulate characters for bold text
                        ind++; // move to the next character
                        // return; // move to the next character without typing
                        continue;
                    }
                    botMessage.innerHTML += char; // append the character
                    chatMessages.scrollTop = chatMessages.scrollHeight; // scroll to the bottom
                    ind++; // move to the next character
                }

                // console.log(botMessage);
                // botMessage.textContent = messageArray[i];
                chatMessages.appendChild(userMessage);
                chatMessages.appendChild(botMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    })

});
var userInput;

function startSpinner() {
    $('#loadingSpinner').removeClass('hidden');
}
function stopSpinner() {
    $('#loadingSpinner').addClass('hidden');
}

function toggleSendButton() {
    var inputElement = document.getElementById('userInput');
    var sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = inputElement.value.trim() === '';
}

function toggleInputField(disable) {
    var userInput = document.getElementById('userInput');
    userInput.disabled = disable;
}

document.getElementById('userInput').addEventListener('input', toggleSendButton);
window.addEventListener('load', toggleSendButton);

document.getElementById('userInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        userInput = document.getElementById('userInput').value;
        var chatMessages = document.getElementById('chatMessages');

        var userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'user-message');

        userMessageDiv.innerHTML = userInput;
        chatMessages.appendChild(userMessageDiv);
        document.getElementById('userInput').value = '';
        toggleSendButton();
        setTimeout(function () {
            simulateBotTyping();
        }, 1000);
        toggleInputField(true);
    }
});

document.getElementById('sendBtn').addEventListener('click', function () {
    userInput = document.getElementById('userInput').value;
    var chatMessages = document.getElementById('chatMessages');

    var userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    userMessageDiv.innerHTML = userInput;
    chatMessages.appendChild(userMessageDiv);
    document.getElementById('userInput').value = '';
    toggleSendButton();
    startSpinner();

    setTimeout(function () {
        simulateBotTyping();
    }, 1000);
    toggleInputField(true);
});

function autoscroll() {
    const msg = chatMessages.lastElementChild;
    const msgstyle = getComputedStyle(msg);
    const msgmargin = parseInt(msgstyle.marginBottom);
    const msgheight = msg.offsetHeight + msgmargin;

    const vis_height = chatMessages.offsetHeight;
    const cont_height = chatMessages.scrollHeight;

    const scroll_offset = chatMessages.scrollTop + vis_height;

    if (cont_height - msgheight <= scroll_offset) {
        requestAnimationFrame(() => {
            super_parent.scrollTop = super_parent.scrollHeight;
        });
    }


}

function simulateBotTyping() {
    console.log("here");
    var chatMessages = document.getElementById('chatMessages');
    var bootloader = document.createElement('div');
    chatMessages.appendChild(bootloader);
    bootloader.classList.add('loader');
    $.ajax({
        type: "POST",
        url: "/post/",
        data: {
            'input_data': userInput,
            'email': email,
            'type': type
        },
        dataType: "json",
        success: function (response) {
            var resultData = response.output;
            console.log("Here is length");
            console.log(resultData);
            var messageInstance = resultData;
            var isTyped = 0;
            setTimeout(function () {
                bootloader.remove()            
                var chatMessages = $('#chatMessages');

                console.log("spinner stopped")
                var botMessageDiv = $('<div></div>').addClass('message bot-message typing');
                chatMessages.append(botMessageDiv);

                var bold = false; // flag to track if text should be bold
                var boldText = ''; // to store characters for bold text
                var i = 0; // index to track characters being typed
                console.log(messageInstance.length);
                // stopSpinner();
                var typingInterval = setInterval(function () {
                    if (i < messageInstance.length) {
                        var char = messageInstance[i];
                        if (messageInstance.substring(i, i + 3) === "<b>") {
                            console.log("bold");
                            bold = true; // set bold flag to true
                            i += 3; // skip "<b>"
                            return; // move to the next character without typing
                        }
                        if (messageInstance.substring(i, i + 4) === "</b>") {
                            bold = false; // set bold flag to false
                            i += 4; // skip "</b>"
                            botMessageDiv.append("<b>" + boldText + "</b>"); // append bold text
                            boldText = ''; // reset bold text
                            return; // move to the next character without typing
                        }
                        if (messageInstance.substring(i, i + 4) === "<br>") {
                            botMessageDiv.append("<br>") // insert <br> tag for newline
                            i += 4; // move to the next character
                            return; // move to the next character without typing
                        }
                        if (bold) {
                            boldText += char; // accumulate characters for bold text
                            i++; // move to the next character
                            return; // move to the next character without typing
                        }
                        botMessageDiv.append(char); // append the character
                        chatMessages.scrollTop(chatMessages.prop('scrollHeight')); // scroll to the bottom
                        i++; // move to the next character
                    } else {
                        isTyped = 1;
                        // console.log("changing Istyped")
                        clearInterval(typingInterval); // stop typing interval
                        botMessageDiv.removeClass('typing'); // add Bot indicator
                        chatMessages.scrollTop(chatMessages.prop('scrollHeight')); // scroll to the bottom
                        toggleInputField(false); //added for freezing input area

                        console.log(response);
                        if (response.hasOwnProperty('link')) {


                            var linkValue = response.link;
                            var currentUrl = window.location.href;
                            var modifiedURL = currentUrl.replace(/\/9999\/?$|\/9999$/, '');
                            console.log(modifiedURL + '/' + linkValue);
                            window.location.href = modifiedURL + '/' + linkValue;
                        }
                    }
                }, 10); // typing speed (adjust as needed)
            }, 1000); // delay before starting typing
            // console.log(isTyped);

        }



        ,
        error: function (error) {
            console.log("Error in request:", error);
        }
    });
}



document.getElementById('newChatBtn').addEventListener('click', function () {
    var lastSlashIndex = window.location.href.lastIndexOf("/");
    var newURL = window.location.href.substring(0, lastSlashIndex - 1);
    console.log(newURL);
    var new_url = newURL.lastIndexOf("/");
    var newww = newURL.substring(0, new_url);

    newURL = newww + '/' + '9999';
    window.location.href = newURL;
});

// $(document).ready(function() {
//     /* for name */
//     var firstName = $("#fName").text();
//     var lastName = $("#lName").text();
//     var intials = $("#fName").text().charAt(0) + $("#lName").text().charAt(0);
//     var profileImage = $("#profileImage").text(intials);
//     /* for random color */
//     var hex = Math.floor(Math.random() * 0xffffff);
//     var a = "#" + ("000000" + hex.toString(16)).substr(-6);
//     $("#profileImage").css("background", a);
//     return a;
//   });

$(document).ready(function () {
    /* for name */
    var firstName = $("#fName").text();
    var lastName = $("#lName").text();

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);

    var initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

    console.log("Initials:", initials);

    $("#profileImage").text(initials); // Set initials as text content

    /* for random color */
    var hex = Math.floor(Math.random() * 0xffffff);
    var color = "#" + ("000000" + hex.toString(16)).substring(hex.toString(16).length - 6); // Using substring to get the last 6 characters

    console.log("Color:", color);

    $("#profileImage").css("background", color); // Set background color
});

$(document).ready(function () {
    // Toggle dropdown menu on clicking profile container
    $("#profileContainer").click(function () {
        $("#userOptionsMenu").toggleClass("show");
    });

    // Close dropdown menu when clicking outside
    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest("#profileContainer").length && !target.closest("#userOptionsMenu").length) {
            $("#userOptionsMenu").removeClass("show");
        }
    });
});







