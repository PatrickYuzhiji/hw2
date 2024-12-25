// Fetch the student data from https://cs571api.cs.wisc.edu/rest/f24/hw2/students. 
// Note that this requires a X-CS571-ID header specifying your unique Badger ID. 
// After fetching this data, console.log the contents of this array.
// Use document to update the element with id num-results to be the number of students in the course. 
// You can use the innerText attribute to change the text within num-results.

fetch("https://cs571.org/rest/f24/hw2/students", {
	method: "GET",
	headers: {
		"X-CS571-ID": "bid_98c5657e8b78dd46d95d3bfc60ab9ce817f77ae20fbae7eefdf042a344e41552"
	}
})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		document.getElementById("num-results").innerText = data.length;
		buildStudents(data);
	})
	.catch(err => {
		console.error(err);
	});


function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
	// Display each student on the webpage. You must use createElement and appendChild like the in-class exercise; 
	// you may not use innerHTML to insert the student data.
	// modify each student's className to give it the responsive col classes (col-12 col-sm-6 col-md-4 col-lg-3)
	// 1 column of students is shown on xs and sm devices
	// 2 columns of students is shown on md devices
	// 3 columns of students is shown on lg devices
	// 4 columns of students is shown on xl or larger devices
	// When an interest is clicked, the search should be re-ran such that all students with that interest are returned. 
	// For example, if John Smith has interests of "Coffee" and "Programming" and a user clicks on the "Coffee" item, 
	// the search terms should be updated and all students with an interest in coffee (as a substring) are displayed.
	studs.forEach((student) => {
		const studentDiv = document.createElement("div");
		studentDiv.classList.add("col-12", "col-sm-12", "col-md-6", "col-lg-4", "col-xl-3");

		const name = document.createElement("h2");
		name.innerText = student.name.first + " " + student.name.last;
		studentDiv.appendChild(name);

		const major = document.createElement("h5");
		major.innerText = student.major;
		studentDiv.appendChild(major);

		const creditUni = document.createElement("p");
		creditUni.innerText = student.name.first + " is taking " + student.numCredits + " credits and " + (student.fromWisconsin ? "is from Wisconsin" : "is not from Wisconsin");
		studentDiv.appendChild(creditUni);

		const interests = document.createElement("p");
		interests.innerText = student.interests.length >0 ? "They have " + student.interests.length + " interests including ...": "They have no interests";
		studentDiv.appendChild(interests);

		if (student.interests.length > 0) {
			const interests_list = document.createElement("ul");
			student.interests.forEach((interest) => {
				const interest_li = document.createElement("li");
				interest_li.innerText = interest;
				interest_li.addEventListener("click", (e) => {
					document.getElementById("search-interest").value = interest;
					handleSearch();
				});
				interests_list.appendChild(interest_li);
			});
			studentDiv.appendChild(interests_list);
		};

		document.getElementById("students").appendChild(studentDiv);
	})
}


function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// TODO Implement the search
	// search terms are case-insensitive, e.g. searching "cat" should yield results with "cAT"
	// search terms are substrings, e.g. "olo" should yield results with "color"
	// search terms are AND expressions, e.g. searching for a name of "Cole", a major of "Computer Science", and an interest of "coffee" should only yield Coles studying computer science who are interested in coffee
	// searching "john", "smith", "john smith", or "ohn smi", should all yield the person named "John Smith"
	// you can achieve this by concatenating each person's first and last name with a space; if the search name is a substring of this concatenation, it is a match
	// if any interest matches the search term, it should be considered a result, e.g. searching "bow" should yield people with interests in "bow hunting", "bowling", or "formal bowing"
	// if a search term is left blank it should not affect the results of the search
	// leading and trailing spaces of search terms should be ignored

	// define the search function to filter the students
	function search(student) {
		// filter by the name
		const searchName = document.getElementById("search-name").value.trim().toLowerCase();
		const fullName = student.name.first.toLowerCase() + " " + student.name.last.toLowerCase();
		const nameMatch = !searchName || fullName.includes(searchName);

		// filter by the major
		const searchMajor = document.getElementById("search-major").value.trim().toLowerCase();
		const major = student.major.toLowerCase();
		const majorMatch = !searchMajor || major.includes(searchMajor);

		// filter by the interest
		const searchInterest = document.getElementById("search-interest").value.trim().toLowerCase();
		const interests = student.interests.map(interest => interest.toLowerCase());
		const interestMatch = !searchInterest || interests.some(interest => interest.includes(searchInterest));

		return nameMatch && majorMatch && interestMatch;
	}

	// get the original student data from API
	fetch("https://cs571.org/rest/f24/hw2/students", {
		method: "GET",
		headers: {
			"X-CS571-ID": "bid_98c5657e8b78dd46d95d3bfc60ab9ce817f77ae20fbae7eefdf042a344e41552"
		}
	})
		.then(res => res.json())
		.then(data => {
				const filteredStudents = data.filter(student => search(student));
				document.getElementById("num-results").innerText = filteredStudents.length;
				document.getElementById("students").innerHTML = "";
				buildStudents(filteredStudents);
			})
		.catch(err => {console.error(err);});
}

document.getElementById("search-btn").addEventListener("click", handleSearch);