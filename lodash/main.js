
const data = [
    { name: 'John', age: 25, city: 'New York', gender: 'male', job: 'engineer' },
      { name: 'Jane', age: 30, city: 'Los Angeles', gender: 'female', job: 'teacher' },
      { name: 'Bob', age: 35, city: 'Chicago', gender: 'male', job: 'scientist' },
      { name: 'Alice', age: 40, city: 'Houston', gender: 'female', job: 'doctor' },
      { name: 'Mike', age: 28, city: 'Philadelphia', gender: 'male', job: 'engineer' },
      { name: 'Paul', age: 32, city: 'Chicago', gender: 'male', job: 'teacher' },
      { name: 'Sophie', age: 45, city: 'Los Angeles', gender: 'female', job: 'scientist' },
      { name: 'Emily', age: 27, city: 'Houston', gender: 'female', job: 'engineer' },
      { name: 'Jacob', age: 30, city: 'New York', gender: 'male', job: 'doctor' },
      { name: 'Jessica', age: 35, city: 'Philadelphia', gender: 'female', job: 'teacher' },
      { name: 'Jacob', age: 42, city: 'New York', gender: 'male', job: 'scientist' },
      { name: 'Alicia', age: 22, city: 'Los Angeles', gender: 'female', job: 'teacher' },
      { name: 'Steven', age: 32, city: 'Chicago', gender: 'male', job: 'engineer' },
      { name: 'Emily', age: 27, city: 'Houston', gender: 'female', job: 'engineer' },
      { name: 'Jacob', age: 30, city: 'New York', gender: 'male', job: 'doctor' },
      { name: 'Jessica', age: 35, city: 'Philadelphia', gender: 'female', job: 'teacher' },
      { name: 'Jacob', age: 42, city: 'New York', gender: 'male', job: 'scientist' },
      { name: 'Alicia', age: 22, city: 'Los Angeles', gender: 'female', job: 'teacher' },
      { name: 'Steven', age: 32, city: 'Chicago', gender: 'male', job: 'engineer' },
      { name: 'Rachel', age: 30, city: 'Houston', gender: 'female', job: 'scientist' },
      { name: 'David', age: 35, city: 'Philadelphia', gender: 'male', job: 'teacher' },
      { name: 'Ethan', age: 28, city: 'New York', gender: 'male', job: 'engineer' },
      { name: 'Samantha', age: 40, city: 'Los Angeles', gender: 'female', job: 'doctor' }
];

function filterData() {
    const ageCheckbox = document.getElementById('filter-age');
    const citySelect = document.getElementById('filter-city');
    const genderSelect = document.getElementById('filter-gender');
    const jobSelect = document.getElementById('filter-job');
    const result = document.getElementById('result');
    let filteredData = data;
    if (ageCheckbox.checked) {
        //filter all the people who are older than 30 
        filteredData = _.filter(filteredData, item => item.age > 30);
    }
    if (citySelect.value !== 'all') {
        //filter by city
        filteredData = _.filter(filteredData, item => item.city === citySelect.value);
    }
    if (genderSelect.value !== 'all') {
        //filter by gender
        filteredData = _.filter(filteredData, item => item.gender === genderSelect.value);
    }
    if (jobSelect.value !== 'all') {
        //filter by job
        filteredData = _.filter(filteredData, item => item.job === jobSelect.value);
    }
    // check if no filters are selected
    if (!ageCheckbox.checked && citySelect.value === 'all' && genderSelect.value === 'all' && jobSelect.value === 'all') {
        filteredData = data;
    }
    // clear the result before displaying new data
    result.innerHTML = '';
    filteredData.forEach(item => {
        // create a new div element
        const div = document.createElement('div');
        div.classList.add("result-item");

        // create a new div element for the name
        const nameDiv = document.createElement('div');
        nameDiv.classList.add("name", "result-subitem");
        const nameText = document.createTextNode(`Name: ${item.name}`);
        nameDiv.appendChild(nameText);
        div.appendChild(nameDiv);

        // create a new div element for the age
        const ageDiv = document.createElement('div');
        ageDiv.classList.add("age", "result-subitem");
        const ageText = document.createTextNode(`Age: ${item.age}`);
        ageDiv.appendChild(ageText);
        div.appendChild(ageDiv);

        // create a new div element for the city
        const cityDiv = document.createElement('div');
        cityDiv.classList.add("city", "result-subitem");
        const cityText = document.createTextNode(`City: ${item.city}`);
        cityDiv.appendChild(cityText);
        div.appendChild(cityDiv);

        // create a new div element for the gender
        const genderDiv = document.createElement('div');
        genderDiv.classList.add("gender", "result-subitem");
        const genderText = document.createTextNode(`Gender: ${item.gender}`);
        genderDiv.appendChild(genderText);
        div.appendChild(genderDiv);

        // create a new div element for the job
        const jobDiv = document.createElement('div');
        jobDiv.classList.add("job", "result-subitem");
        const jobText = document.createTextNode(`Job: ${item.job}`);
        jobDiv.appendChild(jobText);
        div.appendChild(jobDiv);

        // append the div to the result
        result.appendChild(div);
    });
}
window.onload = function () {
    const ageCheckbox = document.getElementById('filter-age');
    const citySelect = document.getElementById('filter-city');
    const genderSelect = document.getElementById('filter-gender');
    const jobSelect = document.getElementById('filter-job');
    ageCheckbox.addEventListener("change", filterData);
    citySelect.addEventListener("change", filterData);
    genderSelect.addEventListener("change", filterData);
    jobSelect.addEventListener("change", filterData);
    filterData();
}