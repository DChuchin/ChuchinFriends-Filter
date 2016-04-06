if (localStorage.getItem('friendsList')) {
	var friendsList = localStorage.getItem('friendsList').split(',');
} else var friendsList = [];
var friends;
new Promise(function(resolve) {
	if (document.readyState === 'complete') {
		resolve();
	} else {
		window.onload = resolve;
	}
}).then(function() {
	return new Promise(function(resolve, reject) {
		VK.init({
			apiId: 5384604
		});

		VK.Auth.login(function(response) {
			if (response.session) {
				resolve(response);
			} else {
				reject(new Error('Не удалось авторизоваться'));
			}
		}, 2);
	});
// }).then(function() {
// 		return new Promise(function(resolve, reject) {
// 			VK.api('users.get', {'name_case': 'gen'}, function(response) {
// 				if (response.error) {
// 					reject(new Error(response.error.error_msg));
// 				} else {
// 					headerInfo.textContent = 'Друзья ' + response.response[0].first_name + ' ' + response.response[0].last_name;

// 					resolve();
// 				}
// 			});
// 		});
	}).then(function() {
	return new Promise(function(resolve, reject) {
		VK.api('friends.get', {'fields': 'photo_50'}, function(response) {
			if (response.error) {
				reject(new Error(response.error.error_msg));
			} else {

				// console.log(response.response);
				// console.log(response);
				friends = response.response;
	
				friends.forEach(function(item, i ,arr){
					var li = createEl(item);
					if (!isChosen(item.uid)) {

						leftList.appendChild(li);
					} else {
						li.classList.add('moved');
						rightList.appendChild(li);	
					}
				});
				resolve();
			}
		});
	});
}).catch(function(e) {
	alert('Ошибка: ' + e.message);
});
function createEl(obj) {
	// var photo = document.createElement('img').setAttribute('src', obj.photo_50),
	// 	name = document.createElement('span');
	var photo = '<div  class="img-wrapper"><img class="photo" src="' + obj.photo_50 +'"></div>',
		name = '<span class="title">' + obj.first_name + ' ' + obj.last_name + '</span>',
		cross = '<a class="add-btn" href="#"></a>',
		li = document.createElement('li');
	li.setAttribute('class', 'friend-item');
	li.setAttribute('draggable', 'true');
	li.setAttribute('data-id', obj.uid);
	li.insertAdjacentHTML('afterbegin', photo + name + cross);
	return li
}

function isChosen(id) {
	for (var i = 0; i < friendsList.length; i++) {
		if (friendsList[i] == id) return true
	};
	return false
};
function addFriend(id) {
	for (var i = 0; i < friendsList.length; i++) {
		if (friendsList[i] == id) {
			return friendsList.splice(i, 1);	
		}
	}
	friendsList.push(id);
};

function moveFriend(e) {
	if (e.target.matches('.add-btn')) {
		var li = e.target.parentElement,
			id = li.dataset.id;
		if (li.matches('.moved')) {
			leftList.appendChild(li);
			li.classList.remove('moved');
		} else {
			rightList.appendChild(li);
			li.classList.add('moved');
		}
		addFriend(id);		
	} 
};
function saveList() {
	localStorage.setItem('friendsList', friendsList);
};
/*------------------- listeners ------------------------*/
var input = document.querySelector('.filter');

input.addEventListener('keyup', function(e) {
	if (e.target.matches('.filter__input_right')) {
		rightList.innerHTML = '';
		friendsList.forEach(function(id) {
			friends.forEach(function(item) {
				if (item.uid == id) {
					if (item.first_name.concat(' ', item.last_name).toLowerCase().includes(e.target.value.trim().toLowerCase())){
						var li = createEl(item);
						li.classList.add('moved');
						rightList.appendChild(li);
					} 
				}
			});
		}); 
	} else { 
		sourceList = leftList.innerHTML;
		leftList.innerHTML = '';
		friends.forEach(function(item) {
			if (!isChosen(item.uid)) {
				if (item.first_name.toLowerCase().includes(e.target.value)){
					var li = createEl(item);
					leftList.appendChild(li);
				} 
			}
		});  
	}	
});
saveBtn.addEventListener('click', saveList);
leftList.addEventListener('dragstart', moveFriend);
columns.addEventListener('click', moveFriend);