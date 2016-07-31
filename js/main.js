/*---------------------- проверка списка друзей в local storage ----------------------*/
if (localStorage.getItem('friendsList')) {
	var friendsList = localStorage.getItem('friendsList').split(',');
} else var friendsList = [];   // массив содержит в себе id пользователей сохраненных в правом списке

var friends;   // переменная получит в себя массив друзей полученных от VK.api

/*---------------------- получение списка друзей от VK.api ---------------------*/
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
	}).then(function() {
	return new Promise(function(resolve, reject) {
		VK.api('friends.get', {'fields': 'photo_50'}, function(response) {
			if (response.error) {
				reject(new Error(response.error.error_msg));
			} else {
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

/*------------------- listeners ------------------------*/
var input = document.querySelector('.filter');

input.addEventListener('keyup', filter);
saveBtn.addEventListener('click', saveList);
columns.addEventListener('click', moveFriend);
leftList.addEventListener('dragstart', dragstart);
rightList.addEventListener('dragover', dragover);
rightList.addEventListener('drop', drop);

/*------------------------ dragNdrop ----------------------*/
function dragstart(e) {
	e.dataTransfer.setData('text', e.target.dataset.id);
	e.target.style.opacity = '0.5';
	e.target.addEventListener('dragend', dragend);
};
function dragend(e) {
	if (e.target.style.opacity) {
		e.target.style.opacity = '1';
	};
};
function dragover(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect='move';
};
function drop(e) {
	e.preventDefault();
	var id = e.dataTransfer.getData('text'),
		friendsArr = leftList.querySelectorAll('.friend-item');
	for(var i = 0; i < friendsArr.length; i++) {
		if(friendsArr[i].dataset.id == id) {
			var li = friendsArr[i];
			li.classList.add('moved');
			rightList.appendChild(li);
			addFriend(id);
		};
	};
};

function createEl(obj) {
//создаем элемент li из объекта полученного от VK.api
	var photo = '<div  class="img-wrapper"><img class="photo" src="' + obj.photo_50 +'" draggable="false"></div>',
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
//проверка наличия искомого id в правом списке
	for (var i = 0; i < friendsList.length; i++) {
		if (friendsList[i] == id) return true
	};
	return false
};

function addFriend(id) {
//добавляет искомый id в правый список, или удаляем, если он удже там есть
	for (var i = 0; i < friendsList.length; i++) {
		if (friendsList[i] == id) {
			return friendsList.splice(i, 1);    
		}
	}
	friendsList.push(id);
};

function moveFriend(e) {
//физическое перемещение друга из одного списка в другой по нажатию на плюсик/крестик
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
//сохраняет информацию о дузьях в правом списке в localStorage
	isSaved.classList.add('visible');
	setTimeout(function(){
	//выводит подсказку о том, что список был сохранен
		isSaved.classList.remove('visible');
	},1000);
	localStorage.setItem('friendsList', friendsList);
};

function filter(e) {
// фильтрация списков
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
				if (item.first_name.concat(' ', item.last_name).toLowerCase().includes(e.target.value.trim().toLowerCase())){
					var li = createEl(item);
					leftList.appendChild(li);
				} 
			}
		});  
	}
};

