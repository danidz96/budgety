// BUDGET CONTROLLER
var budgetController = (function () {
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, Id;

            //Create new Id
            if (data.allItems[type].length > 0) {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(Id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(Id, des, val);
            }
            
            //Push it into our data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;
        }, 
        testing: function () {
            console.log(data);
        }
    };

})();

// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputButton: '.add_btn'
    };
    
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', event => {

            if (event.keyCode === 13) {
                ctrlAddItem();
            }   
        });
    };

    var ctrlAddItem = function () {
        var input, newItem;
                
        // Get the field input data
        input = UICtrl.getInput();
        console.log(input);

        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // Add the item to the UI

        // Calculate the budget

        // Display the budget on the UI

    };

    return {
        init: function () {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();