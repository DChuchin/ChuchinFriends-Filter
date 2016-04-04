var friendsList = [];

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
				var friends = response.response,
					source = friendsItemTemplate.innerHTML,
					templateFn = Handlebars.compile(source),
					template = templateFn({list: friends});

				
				friends.forEach(function(item, i ,arr){
					if (isChosen(item)) {
						friendsList.push(item.uid);	
					}	
				});
				leftList.innerHTML = template;
				createElement(friends[0]);
				resolve();
			}
		});
	});
}).catch(function(e) {
	alert('Ошибка: ' + e.message);
});
function createElement(obj) {
	var photo = '<div  class="img-wrapper"><img class="photo" src="' + obj.photo_50 +'"></div>',
		name = '<span class="title">' + obj.first_name + ' ' + obj.last_name + '</span>',
		status = '<span class="isOnline">online</span>',
		cross = '<a class="add-btn" href="#"></a>',
		li = '<li class="friend-item" draggable="true" data-id="' + obj.uid + '"></li>';
	// li = li.appendChild(photo).appendChild(name);
	// if (obj.online) {
	// 	li = li.appendChild(status);
	// }
	// li = li.appendChild(cross);

	console.log(li);
}
function showFriends() {
	 var friends = response.response,
					source = friendsItemTemplate.innerHTML,
					templateFn = Handlebars.compile(source),
					template = templateFn({list: friends});

				// results.innerHTML = template;

};
function isChosen(id) {
	for (var i = 0; i < friendsList.length; i++) {
		if (friendsList[i] == id) return true
	};
	return false
};
var flag;

// function addFriend(id) {
// 	friendsList.forEach(function(item, i, arr) {

// 		console.log(friendsList);
// 	})
// }


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
		function addFriend(id) {
			for (var i = 0; i < friendsList.length; i++) {
				if (friendsList[i] == id) {
					return friendsList.splice(i, 1);	
				}
			}
			friendsList.push(id);
		};
		


			console.log(friendsList);
		
		
	} else if (e.type === 'dragstart') {
		console.log(e.target);
		// if (!e.target.matches('.friends-list')) {
		// 	var sourceLi = e.target.closest('.friend-item'),
		// 		li = sourceLi.cloneNode(true),
		// 		id = li.dataset.id;
		// 		console.log(li);
		// 	dragStart(sourceLi);
		// 	rightColumn.addEventListener('dragenter', function() {
		// 		sourceLi.addEventListener('dragend', function () {
		// 			// console.log("dragend");
		// 				rightColumn.appendChild(li);
		// 				leftColumn.appendChild(sourceLi);
		// 		});
		// 	});		
		// }
	}
}
// function getMoved(id) {
// 	console.log('move');
// 	friendsList.forEach(function(item, i, arr){
// 		if (item.id == id) {
// 			if (item.isChosen) {
// 				item.isChosen = false
// 			} else item.isChosen = true;
// 		}
// 	});
// }

function dragStart(el) {
	el.style.opacity = '0.4';
}
function dragEnter() {
	flag = true;
	console.log(flag);
}
function dragLeave() {
	flag = false;
	console.log(flag);
}


// function filter()
function createElement(obj) {

}

/*------------------- listeners ------------------------*/
var input = document.querySelector('.filter');


input.addEventListener('keyup', function() {
	console.log('tap');
})

leftList.addEventListener('dragstart', moveFriend);
columns.addEventListener('click', moveFriend);