const searchButton = document.getElementById('searchBtn');
const queryInput = document.getElementById('queryInput');
const pageNum = document.getElementById('num-pages');
pageNum.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '');
});

const resultsContainer = document.getElementById('results');
const resetBtn = document.getElementById('reset-button');

searchButton.addEventListener('click', searchJobs);

function searchJobs(e) {
  searchButton.disabled= true;
  queryInput.value === '' ? alert("Please fill out the field") : e.preventDefault();
  const query = queryInput.value;
  const apiKey = '759e0c73camsh6768755c61b559bp137359jsn1451d9501b34';
  const apiUrl = 'https://jsearch.p.rapidapi.com/search';
  const page = '1';
  const numPages = pageNum.value <= 0 ? 1 : pageNum.value;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  fetch(`${apiUrl}?query=${encodeURIComponent(query)}&page=${page}&num_pages=${numPages}`, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request failed');
      }
    })
    .then(result => {
      const jobDataList = result.data;
      displayJobInformation(jobDataList);


      localStorage.setItem('searchedJobs', JSON.stringify(jobDataList));

      searchButton.disabled= false;
      
      queryInput.value = "";
      pageNum.value = 1;
    })
    .catch(error => {
      console.error(error);
      searchButton.disabled= false;
      queryInput.value = "";
      pageNum.value = 1;
    });
}

function displayJobInformation(jobDataList) {
  if (jobDataList.length === 0) {
    resultsContainer.innerHTML = "<p style= 'text-align: center;'>No results found.</p>";
    resetBtn.style.display= "grid";
    return;
  }

  jobDataList.sort((a, b) => {
    const dateA = new Date(a.job_posted_at_datetime_utc);
    const dateB = new Date(b.job_posted_at_datetime_utc);
    return dateB - dateA;
  });

  let jobHTML = '';

  jobDataList.forEach(jobData => {

    const jobTitle = jobData.job_title;
    const employerName = jobData.employer_name;
    const employerLogo = jobData.employer_logo;
    const jobDescription = jobData.job_description;
    const jobApplyLink = jobData.job_apply_link;
    const jobPostedAtUtc = jobData.job_posted_at_datetime_utc;

    let logoHTML = '';
    if (employerLogo) {
      logoHTML = `<img src="${employerLogo}" alt="Employer Logo">`;
    }

    const datePosted = new Date(jobPostedAtUtc);
    const formattedDatePosted = datePosted.toLocaleDateString();

    jobHTML += `
      <div class="card">
        <h2>${jobTitle}</h2>
        <p><strong>Employer:</strong> ${employerName}</p>
        <p><strong>Date Posted:</strong> ${formattedDatePosted}</p>
        ${logoHTML}
        <pre>${jobDescription}</pre>
        <a href="${jobApplyLink}" target="_blank">Apply Now</a>
      </div>
    `;
  });
  
  resultsContainer.innerHTML = jobHTML;
  resetBtn.style.display = "block";
}

window.addEventListener('DOMContentLoaded', () => {
  const storedJobs = localStorage.getItem('searchedJobs');
  if (storedJobs) {
    const jobDataList = JSON.parse(storedJobs);
    displayJobInformation(jobDataList);
    resetBtn.style.display = "block"; 
  } else {
    resetBtn.style.display = "none"; 
  }
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem('searchedJobs');
  resultsContainer.innerHTML = "";
  resetBtn.style.display = "none"; 
});