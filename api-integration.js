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
  getLatestNotifications: () => APIService.fetchData("/notifications"),
  getFeaturedExams: () => APIService.fetchData("/exams"),
  getTopColleges: () =>
    APIService.fetchData(
      "/api/universityys?populate[logo][populate]=true&populate[tabs][populate][sections]=true&populate[highlights][populate]=true&filters[slug][$in]=iim-mumbai&filters[slug][$in]=sjmsom-mumbai&filters[slug][$in]=sibmt-pune&filters[slug][$in]=nmims-anil-surendra-modi-school-of-commerce&filters[slug][$in]=icfai-business-school-ibs-mumbai&filters[slug][$in]=atlas-skilltech-university&filters[slug][$in]=sp-jain-institute-of-management-and-research&filters[slug][$in]=sjmsom-mumbai&filters[slug][$in]=nmims-anil-surendra-modi-school-of-commerce&filters[slug][$in]=symbiosis-centre-for-management-and-human-resource-development&filters[slug][$in]=jamnalal-bajaj-institute-of-management-studies&filters[slug][$in]=iim-nagpur&filters[slug][$in]=institute-of-management-technology-imt-n-nagpur"
    ),
  getFaqs: () => APIService.fetchData("/faqs"),
};

// Component handlers
const NotificationsHandler = {
  async loadNotifications() {
    try {
      const notificationsContainer = document.querySelector(
        "#notifications-container"
      );
      notificationsContainer.innerHTML =
        '<div class="text-center py-4">Loading notifications...</div>';

      const notifications = await APIService.getLatestNotifications();

      const notificationsHTML = notifications
        .map(
          (notification) => `
                <div class="bg-white rounded-lg shadow p-4">
                    <img src="${
                      notification.image || "/api/placeholder/400/200"
                    }" 
                         alt="${notification.title}" 
                         class="w-full h-48 object-cover rounded mb-4">
                    <h3 class="font-semibold mb-2">${notification.title}</h3>
                    <p class="text-gray-600 text-sm mb-4">${
                      notification.description
                    }</p>
                    <button onclick="window.location.href='${
                      notification.link
                    }'" 
                            class="bg-[#C41E3A] hover:bg-[#A01830] text-white px-4 py-2 rounded">
                        Read More
                    </button>
                </div>
            `
        )
        .join("");

      notificationsContainer.innerHTML = notificationsHTML;
    } catch (error) {
      notificationsContainer.innerHTML = `
                <div class="text-center py-4 text-red-600">
                    Failed to load notifications. Please try again later.
                </div>
            `;
    }
  },
};

const ExamsHandler = {
  async loadExams() {
    try {
      const examsContainer = document.querySelector("#exams-container");
      examsContainer.innerHTML =
        '<div class="text-center py-4">Loading exams...</div>';

      const exams = await APIService.getFeaturedExams();

      const examsHTML = exams
        .map(
          (exam) => `
                <div class="text-center">
                    <img src="${exam.logo || "/api/placeholder/100/100"}" 
                         alt="${exam.name}" 
                         class="mx-auto mb-2">
                    <p class="font-semibold">${exam.name}</p>
                    <p class="text-sm">Exam Date: ${exam.examDate}</p>
                </div>
            `
        )
        .join("");

      examsContainer.innerHTML = examsHTML;
    } catch (error) {
      examsContainer.innerHTML = `
                <div class="text-center py-4 text-red-600">
                    Failed to load exams. Please try again later.
                </div>
            `;
    }
  },
};
const CollegesHandler = {
  async loadColleges() {
    try {
      const collegesContainer = document.querySelector("#colleges-container");
      collegesContainer.innerHTML =
        '<div class="text-center py-4">Loading colleges...</div>';

      const colleges = await APIService.getTopColleges();

      const collegesHTML = colleges.data
        .map((college) => {
          // Safely get the logo URL with fallback
          const logoUrl =
            college.attributes.logo?.data?.attributes?.url ||
            "https://via.placeholder.com/150";
          const highlights = college.attributes.highlights || [];

          // Create highlights table HTML with new design
          const highlightsTableHTML = `
                    <div class="mt-6 p-6">
                    <div class="prose">
                    ${college.attributes.tabs[0].sections[0].content}
                    </div>
                        <div class=" ">
                            <h4 class="text-xl font-bold mb-2">${
                              college.attributes.title
                            } Highlights</h4>
                        </div>
                        <div class="border border-gray-200">
                            ${highlights
                              .map(
                                (highlight, index) => `
                                <div class="flex ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }">
                                    <div class="w-1/3 p-4 border-r border-gray-200">
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
                         <div class="prose">
                  

                    ${college.attributes.tabs[1].sections[0].content}

    </div>
 
                    </div>
                    </div>
                `;

          // College Header Section
          const headerSection = `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="flex flex-wrap md:flex-nowrap gap-6 p-6">
                            <div class="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                <img src="${logoUrl}" 
                                     alt="${college.attributes.title}" 
                                     class="w-full h-full object-contain">
                            </div>
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold text-gray-900 mb-4">${
                                  college.attributes.title
                                }</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p class="text-sm font-medium text-gray-500">Annual Fees Range</p>
                                        <p class="mt-1 text-base font-semibold text-gray-900">${
                                          college.attributes.fees || "N/A"
                                        }</p>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-500">Average Package</p>
                                        <p class="mt-1 text-base font-semibold text-gray-900">${
                                          college.attributes.avg_package ||
                                          "N/A"
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
                                <button class="bg-[#C41E3A] hover:bg-[#A01830] text-white px-6 py-2 rounded-lg transition-colors duration-200 w-full md:w-auto">
                                    Apply Now
                                </button>
                                <a href="#" class="text-[#C41E3A] hover:text-[#A01830] text-sm font-medium">
                                    View Details →
                                </a>
                            </div>
                        </div>

                        ${highlightsTableHTML}
                    </div>
                `;

          return headerSection;
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

const FAQHandler = {
  async loadFAQs() {
    try {
      const faqsContainer = document.querySelector("#faqs-container");
      faqsContainer.innerHTML =
        '<div class="text-center py-4">Loading FAQs...</div>';

      const faqs = await APIService.getFaqs();

      const faqsHTML = faqs
        .map(
          (faq) => `
                <div class="border rounded-lg p-4">
                    <button class="flex justify-between items-center w-full text-left">
                        <span class="font-semibold">${faq.question}</span>
                        <svg class="w-5 h-5 transition-transform duration-200" 
                             fill="none" 
                             stroke="currentColor" 
                             viewBox="0 0 24 24">
                            <path stroke-linecap="round" 
                                  stroke-linejoin="round" 
                                  stroke-width="2" 
                                  d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div class="mt-2 text-gray-600 hidden transition-all duration-200">
                        ${faq.answer}
                    </div>
                </div>
            `
        )
        .join("");

      faqsContainer.innerHTML = faqsHTML;

      // Reinitialize FAQ toggles
      initFAQToggles();
    } catch (error) {
      faqsContainer.innerHTML = `
                <div class="text-center py-4 text-red-600">
                    Failed to load FAQs. Please try again later.
                </div>
            `;
    }
  },
};

// Initialize FAQ toggles
function initFAQToggles() {
  document.querySelectorAll(".border.rounded-lg").forEach((faq) => {
    const button = faq.querySelector("button");
    const content = faq.querySelector("div.mt-2");

    button.addEventListener("click", () => {
      content.classList.toggle("hidden");
      const svg = button.querySelector("svg");
      svg.style.transform = content.classList.contains("hidden")
        ? "rotate(0deg)"
        : "rotate(180deg)";
    });
  });
}

// Initialize all data loading
document.addEventListener("DOMContentLoaded", () => {
  NotificationsHandler.loadNotifications();
  ExamsHandler.loadExams();
  CollegesHandler.loadColleges();
  FAQHandler.loadFAQs();
});
