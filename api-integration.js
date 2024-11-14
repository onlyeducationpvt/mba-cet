// API Service for different endpoints
const APIService = {
  baseURL: "https://admin.onlyeducation.co.in", // Replace with your actual API base URL

  // Generic fetch wrapper with error handling
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  // Specific API endpoints
  // getLatestNotifications: () => APIService.fetchData("/api/news?populate[image]=true&filters[category][slug][$eq]=mba"),
  getFeaturedExams: () =>
    APIService.fetchData(
      "/api/exams?populate[exam_logo][populate]=true&populate[highlights][populate]=true&filters[slug][$in]=cat-common-admission-test&filters[slug][$in]=xat-xavier-aptitude-test&filters[slug][$in]=cmat-common-management-admission-test&filters[slug][$in]=mat-management-aptitude-test&filters[slug][$in]=nmat-nmat-by-gmac&filters[slug][$in]=snap-symbiosis-national-aptitude-test&filters[slug][$in]=ipmat-iim-indore-integrated-program-in-management-aptitude-test&filters[slug][$in] =ibsat-ibs-aptitude-test&filters[slug][$in]=mat-management-aptitude-test"
    ),
  getTopColleges: () =>
    APIService.fetchData(
      "/api/universityys?populate[logo][populate]=true&populate[tabs][populate][sections]=true&populate[highlights][populate]=true&filters[slug][$in]=iim-mumbai&filters[slug][$in]=sjmsom-mumbai&filters[slug][$in]=sibmt-pune&filters[slug][$in]=nmims-anil-surendra-modi-school-of-commerce&filters[slug][$in]=icfai-business-school-ibs-mumbai&filters[slug][$in]=atlas-skilltech-university&filters[slug][$in]=sp-jain-institute-of-management-and-research&filters[slug][$in]=sjmsom-mumbai&filters[slug][$in]=nmims-anil-surendra-modi-school-of-commerce&filters[slug][$in]=symbiosis-centre-for-management-and-human-resource-development&filters[slug][$in]=jamnalal-bajaj-institute-of-management-studies&filters[slug][$in]=iim-nagpur&filters[slug][$in]=institute-of-management-technology-imt-n-nagpur"
    ),
  getFaqs: () => APIService.fetchData("/faqs"),
};

// Component handlers
document.addEventListener("DOMContentLoaded", async () => {
  // Function to load news data from API
  async function loadNews() {
    const container = document.getElementById("news-slider-container");
    container.innerHTML = '<div class="text-center py-4">Loading news...</div>';
    try {
      const response = await fetch(
        "https://admin.onlyeducation.co.in/api/news?populate[image]=true&filters[category][slug][$eq]=mba"
      );
      const { data } = await response.json();

      const newsHTML = data
        .map(
          (item) => `
              <div class="swiper-slide">
                  <div class="news-card">
                      <img src="${item.attributes.image.data.attributes.url}" alt="${item.attributes.title}" />
                      <div class="news-card-content">
                          <h3 class="line-clamp-2">${item.attributes.title}</h3>
                          <p class="line-clamp-3">${item.attributes.description}...</p>
                         <button onclick="window.location.href='/news.html?id=${item.id}'">Read More</button>

                      </div>
                  </div>
              </div>
          `
        )
        .join("");

      container.innerHTML = newsHTML;

      // Initialize Swiper after adding slides
      new Swiper(".swiper-container", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          // Enable autoplay
          delay: 3000, // Slide delay in milliseconds
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    } catch (error) {
      container.innerHTML =
        '<div class="text-center py-4 text-red-600">Failed to load news. Please try again later.</div>';
    }
  }

  // Load news on page load
  loadNews();
});

const ExamsHandler = {
  // Previous helper methods remain same
  processHighlights(highlights) {
    const processedHighlights = new Map();
    highlights.forEach((highlight) => {
      if (!processedHighlights.has(highlight.key)) {
        processedHighlights.set(highlight.key, highlight.value);
      }
    });
    return processedHighlights;
  },

  formatHighlightValue(key, value) {
    if (key === "Application Fee") {
      const fees = [...new Set(value.split(","))];
      return fees.join(", ");
    }
    if (key === "Mode Of Exam" || key === "Mode Of Application") {
      const modes = [...new Set(value.split(",").map((mode) => mode.trim()))];
      return modes.join(", ");
    }
    return value;
  },

  toggleHighlights(examId) {
    const hiddenRows = document.querySelectorAll(
      `#exam-${examId} .hidden-highlights`
    );
    const toggleButton = document.querySelector(`#toggle-${examId}`);
    const toggleText = document.querySelector(`#toggle-text-${examId}`);

    hiddenRows.forEach((row) => {
      row.classList.toggle("show");
    });

    if (toggleButton.classList.contains("expanded")) {
      toggleButton.classList.remove("expanded");
      toggleText.textContent = "Read More";
    } else {
      toggleButton.classList.add("expanded");
      toggleText.textContent = "Read Less";
    }
  },

  async loadExams() {
    try {
      const examsContainer = document.querySelector("#exams-container");
      examsContainer.innerHTML =
        '<div style="text-align: center; padding: 1rem;">Loading exams...</div>';

      const response = await APIService.getFeaturedExams();
      const exams = response.data;

      const examsHTML = exams
        .map((exam, index) => {
          const {
            attributes: {
              title,
              conducting_body,
              accepting_colleges,
              exam_type,
              exam_level,
              exam_logo,
              highlights,
            },
          } = exam;

          const logoUrl =
            exam_logo?.data?.attributes?.url || "/api/placeholder/120/120";
          const processedHighlights = Array.from(
            this.processHighlights(highlights)
          );

          // First 3 highlights
          const initialHighlights = processedHighlights
            .slice(0, 2)
            .map(([key, value]) => {
              const formattedValue = this.formatHighlightValue(key, value);
              return `
                      <tr>
                          <td>${key}</td>
                          <td class="">${formattedValue}</td>
                      </tr>
                  `;
            })
            .join("");

          // Remaining highlights
          const remainingHighlights = processedHighlights
            .slice(3)
            .map(([key, value]) => {
              const formattedValue = this.formatHighlightValue(key, value);
              return `
                      <tr class="hidden-highlights">
                          <td >${key}</td>
                          <td>${formattedValue}</td>
                      </tr>
                  `;
            })
            .join("");

          // Toggle button HTML
          const toggleButton =
            processedHighlights.length > 3
              ? `
                  <div class="toggle-container">
                      <button 
                          class="toggle-button" 
                          id="toggle-${index}" 
                          onclick="ExamsHandler.toggleHighlights(${index})">
                          <span id="toggle-text-${index}">Read More</span>
                          <span class="arrow"></span>
                      </button>
                  </div>
              `
              : "";

          return `
                  <div class="exam-card" id="exam-${index}">
                      <div class="exam-header">
                          <div class="exam-header-content">
                              <div class="exam-logo">
                                  <img src="${logoUrl}" alt="${title}" />
                              </div>
                              <div class="exam-main-info">
                                  <h3 class="exam-title">${title}</h3>
                                  <p class="exam-detail">
                                      <strong>Conducting Body:</strong> ${conducting_body}
                                  </p>
                                  <p class="exam-detail">
                                      <strong>Accepting Colleges:</strong> ${accepting_colleges}
                                  </p>
                              </div>
                              <div class="exam-actions">
                                  <button class="btn-primary popup-trigger" onclick="openPopup()">Apply Now</button>
                              </div>
                          </div>
                      </div>
                      <div class="exam-highlights px-6 py-3">
                          <h4 class="text-xl font-bold mb-2">Highlights</h4>
                          <table class="highlights-table">
                              <tbody>
                                  ${initialHighlights}
                                  ${remainingHighlights}
                              </tbody>
                          </table>
                          ${toggleButton}
                      </div>
                  </div>
              `;
        })
        .join("");

      examsContainer.innerHTML = examsHTML;
    } catch (error) {
      console.error("Error loading exams:", error);
      examsContainer.innerHTML = `
              <div style="text-align: center; padding: 1rem; color: #dc2626;">
                  <p style="font-size: 1.25rem; font-weight: 600;">Failed to load exams</p>
                  <p style="font-size: 0.875rem; margin-top: 0.5rem;">Please try again later</p>
              </div>
          `;
    }
  },
};

const CollegesHandler = {
  toggleContent(collegeId) {
    const preview = document.querySelector(`#content-preview-${collegeId}`);
    const button = document.querySelector(`#toggle-button-${collegeId}`);
    const buttonText = document.querySelector(`#toggle-text-${collegeId}`);
    const sectionsWrapper = document.querySelector(
      `#sections-wrapper-${collegeId}`
    );

    preview.classList.toggle("expanded");
    button.classList.toggle("expanded");
    sectionsWrapper.classList.toggle("show");

    if (preview.classList.contains("expanded")) {
      buttonText.textContent = "Read Less";
    } else {
      buttonText.textContent = "Read More";
    }
  },

  async loadColleges() {
    try {
      const collegesContainer = document.querySelector("#colleges-container");
      collegesContainer.innerHTML =
        '<div class="text-center py-4">Loading colleges...</div>';

      const colleges = await APIService.getTopColleges();

      const collegesHTML = colleges.data
        .map((college, index) => {
          const logoUrl =
            college.attributes.logo?.data?.attributes?.url ||
            "https://via.placeholder.com/150";
          const highlights = college.attributes.highlights || [];

          return `
                  <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                      <!-- College header -->
                      <div class="flex flex-col md:flex-row gap-4  md:gap-6 p-6">
                          <div class="md:w-32 md:h-32 w-24 h-24 m-auto flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                              <img src="${logoUrl}" alt="${
            college.attributes.title
          }" class="w-full h-full object-contain">
                          </div>
                          <div class="flex-1">
                              <h3 class="md:text-2xl sm:text-center md:text-left text-left text-xl font-bold text-gray-900 mb-4">${
                                college.attributes.title
                              }</h3>
                              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                                  <div>
                                      <p class="text-sm font-medium text-gray-500">Annual Fees Range</p>
                                      <p class="mt-1 text-base font-semibold text-gray-900">${
                                        college.attributes.fees || "N/A"
                                      }</p>
                                  </div>
                                  <div>
                                      <p class="text-sm font-medium text-gray-500">Average Package</p>
                                      <p class="mt-1 text-base font-semibold text-gray-900">${
                                        college.attributes.avg_package || "N/A"
                                      }</p>
                                  </div>
                                  <div>
                                      <p class="text-sm font-medium text-gray-500">Institute Type</p>
                                      <p class="mt-1 text-base font-semibold text-gray-900">${
                                        college.attributes.ownership || "N/A"
                                      }</p>
                                  </div>
                              </div>
                          </div>
                          <div class="flex flex-col gap-2 items-start md:items-end justify-center">
                              <button class="bg-[#C41E3A] hover:bg-[#A01830] text-white px-6 py-2 rounded-lg transition-colors duration-200 w-full md:w-auto popup-trigger" onclick="openPopup()">
                                  Apply Now
                              </button>
                          </div>
                      </div>

                      <!-- College content -->
                      <div class="px-6">
                          <!-- Preview content -->
                          <div class="prose">
                              <div id="content-preview-${index}" class="content-preview mb-4">
                                  ${
                                    college.attributes.tabs[0].sections[0]
                                      .content
                                  }
                              </div>
                          </div>

                          <!-- Additional sections -->
                          <div id="sections-wrapper-${index}" class="sections-wrapper">
                              <!-- Highlights section -->
                              <div class="mt-6">
                                  <h4 class="text-xl font-bold mb-2">${
                                    college.attributes.title
                                  } Highlights</h4>
                                  <div class="border border-gray-200 w-full overflow-scroll">
                                      ${highlights
                                        .map(
                                          (highlight, idx) => `
                                          <div class="flex ${
                                            idx % 2 === 0
                                              ? "bg-white"
                                              : "bg-gray-50"
                                          }">
                                              <div class="w-full sm:w-1/3 p-4 border-r border-gray-200">
                                                  <span class="font-medium text-gray-700">${
                                                    highlight.key
                                                  }</span>
                                              </div>
                                              <div class="w-2/3 p-4">
                                                  <span class="text-gray-900">${
                                                    highlight.value
                                                  }</span>
                                              </div>
                                          </div>
                                      `
                                        )
                                        .join("")}
                                  </div>
                              </div>

                              <!-- Tabs content -->
                              ${college.attributes.tabs[1].sections
                                .map(
                                  (item) => `
                                  <div class="mt-6 prose prose-table:mt-8 prose-table:text-sm prose-th:border prose-th:border-gray-300 prose-th:p-4 prose-td:border prose-td:border-gray-300 prose-td:p-4">
                                      ${item.content}
                                  </div>
                              `
                                )
                                .join("")}
                          </div>

                          <!-- Toggle button at the bottom -->
                          <div class="toggle-container mt-4 mb-4">
                              <button 
                                  id="toggle-button-${index}" 
                                  class="toggle-button"
                                  onclick="CollegesHandler.toggleContent(${index})">
                                  <span id="toggle-text-${index}">Read More</span>
                                  <span class="arrow"></span>
                              </button>
                          </div>
                      </div>
                  </div>
              `;
        })
        .join("");

      collegesContainer.innerHTML = collegesHTML;
    } catch (error) {
      console.error("Error loading colleges:", error);
      collegesContainer.innerHTML = `
              <div class="text-center py-4 text-red-600">
                  <p class="text-xl font-semibold">Failed to load colleges</p>
                  <p class="text-sm mt-2">Please try again later</p>
              </div>
          `;
    }
  },
};

// Initialize all data loading
document.addEventListener("DOMContentLoaded", () => {
  // NotificationsHandler.loadNotifications();
  ExamsHandler.loadExams();
  CollegesHandler.loadColleges();
  FAQHandler.loadFAQs();
});
