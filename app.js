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
        }
    };

})();

// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputButton: '.add_btn',
        incomeContainer: '.income_list',
        expensesContainer: '.expenses_list'
    };
    
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html ='<div class="item" id="income-%id%"><div class="item_description">%description%</div><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item" id="expense-%id%"><div class="item_description">%description%</div><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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

        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

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