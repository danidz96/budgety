// BUDGET CONTROLLER
var budgetController = (function () {
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
        
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(element => {
            sum = sum + element.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(current => current.id);
            index = ids.indexOf(id);

            if (index != -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

        calculateBudget: function () {

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget:
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the % of income that we expend
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach( item => {
                item.calculatePercentage(data.totals.inc);
            });

        },

        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(cur => cur.getPercentage());
            return allPercentages;
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
        inputButton: '.add_btn',
        incomeContainer: '.income_list',
        expensesContainer: '.expenses_list',
        budgetLabel: '.budget_value',
        incomeLabel: '.budget_income-value',
        expensesLabel: '.budget_expenses-value',
        percentageLabel: '.budget_expenses-percentage',
        container: '.container',
        expensesPercLabel: '.item_percentage',
        dateLabel : '.budget_title-month'
    };

    var formatNumber = function(num, type){

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + num.toLocaleString(undefined, {minimumFractionDigits:2}, {maximumFractionDigits:2});
    };
    
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html ='<div class="item" id="inc-%id%"><div class="item_description">%description%</div><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item" id="exp-%id%"><div class="item_description">%description%</div><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {
            var item = document.getElementById(selectorID);

            item.parentNode.removeChild(item);
        },

        clearFields: function () {
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fields.forEach( field => {
                field.value = '';
            });

            fields[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
        
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
            
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);                    
                }
            };

            nodeListForEach(fields, function (current, index) {
                console.log(fields, current);
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayDate: function () {
            var now, year, month;

            now = new Date();

            year = now.getFullYear();
            month = now.toLocaleString('en-US', { month: "long" });

            document.querySelector(DOMstrings.dateLabel).textContent = month + ', ' + year;

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();
    var setupEventListeners = function () {
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', event => {

            if (event.keyCode === 13) {
                ctrlAddItem();
            }   
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return th budget
        var budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {
        
        // Calculate percentages
        budgetCtrl.calculatePercentages();

        // Read percentages grom budget controller
        var percentages = budgetCtrl.getPercentages();

        // Update UI
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAddItem = function () {
        var input, newItem;
                
        // Get the field input data
        input = UICtrl.getInput();

        if (input.description != '' && !isNaN(input.value) && input.value > 0) {
            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Clear the fields
            UICtrl.clearFields();
            document.querySelector(DOM.inputDescription).classList.remove('input_error');
            document.querySelector(DOM.inputValue).classList.remove('input_error');

            // Calculate and update budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages();

        } else {
            document.querySelector(DOM.inputDescription).classList.add('input_error');
            document.querySelector(DOM.inputValue).classList.add('input_error');
        }
        
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
        }

        // Delete the item from data structure
        budgetCtrl.deleteItem(type, id);

        // Delete the item from the UI
        UICtrl.deleteListItem(itemID);

        // Update and show the new budget
        updateBudget();

        // Calculate and update percentages
        updatePercentages();

    };

    return {
        init: function () {
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
