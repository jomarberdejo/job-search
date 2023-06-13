const searchButton = document.getElementById('searchBtn');
    const queryInput = document.getElementById('queryInput');
    const pageNum= document.getElementById('num-pages');
    const resultsContainer = document.getElementById('results');

    
    searchButton.addEventListener('click', searchJobs);
    

    function searchJobs(e) {
      queryInput.value === ''? alert("Please fill out the field") : e.preventDefault();
      const query = queryInput.value; 
      const apiKey = 'f46403cfb7mshad35f9146e89e1ep113d1cjsndb129cd6a619';
      const apiUrl = 'https://jsearch.p.rapidapi.com/search';
      const page = '1';
      const numPages = pageNum.value <= 0? 1 : pageNum.value;
    
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
          searchButton.setAttribute('disabled', 'true');
        })
        .catch(error => {
          console.error(error);
          searchButton.setAttribute('disabled', 'true');
        });
    }

    function displayJobInformation(jobDataList) {
      let jobHTML = '';

      jobDataList.forEach(jobData => {
        const jobTitle = jobData.job_title;
        const employerName = jobData.employer_name;
        const employerLogo = jobData.employer_logo;
        const jobDescription = jobData.job_description;
        const jobApplyLink = jobData.job_apply_link;

        let logoHTML = '';
        if (employerLogo) {
          logoHTML = `<img src="${employerLogo}" alt="Employer Logo">`;
        }

        jobHTML += `
          <div class="card">
            <h2>${jobTitle}</h2>
            <p><strong>Employer:</strong> ${employerName}</p>
            ${logoHTML}
            <pre>${jobDescription}</pre>
            <a href="${jobApplyLink}" target="_blank">Apply Now</a>
          </div>
        `;
      });

      resultsContainer.innerHTML = jobHTML;
    }
