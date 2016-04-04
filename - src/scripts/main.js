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
					var someFriend = {};
						someFriend.id = item.uid;
					if (isChosen(item)) {	
						someFriend.isChosen = true;
					} else {
						someFriend.isChosen = false;
					}
					friendsList.push(someFriend);
				});
				// console.log(friendsList);

				
			


				leftList.innerHTML = template;

				resolve();
			}
		});
	});
}).catch(function(e) {
	alert('Ошибка: ' + e.message);
});

function showFriends() {
	 var friends = response.response,
					source = friendsItemTemplate.innerHTML,
					templateFn = Handlebars.compile(source),
					template = templateFn({list: friends});

				// results.innerHTML = template;

};
function isChosen(obj) {
	return false
};
var flag;


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
		getMoved(id);
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
function getMoved(id) {
	console.log('move');
	friendsList.forEach(function(item, i, arr){
		if (item.id == id) {
			if (item.isChosen) {
				item.isChosen = false
			} else item.isChosen = true;
		}
	});
}

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


/*------------------- listeners ------------------------*/
var input = document.querySelector('.filter');


input.addEventListener('keyup', function() {
	console.log('tap');
})

leftList.addEventListener('dragstart', moveFriend);
columns.addEventListener('click', moveFriend);