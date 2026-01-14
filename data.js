// Available industries for selection
const INDUSTRIES = [
  "CPG",
  "Retail",
  "Entertainment",
  "Fashion",
  "E-commerce",
  "Health & Wellness",
  "Technology",
  "Food & Beverage",
  "Beauty",
  "Sports",
  "Travel",
  "Automotive",
  "Home Goods",
  "Direct Sales",
  "Wholesale",
  "Online",
  "Event Marketing",
  "Partnerships",
  "Digital Marketing",
  "Research"
];

// Mock data for tactics - matching Figma specification exactly
const TACTICS_DATA = [
  {
    id: 1,
    name: "Develop a content calendar focusing on high-visibility topics",
    status: "modified", // draft, modified, published
    active: true,
    bestPracticesCount: 10,
    linkedObjectivesCount: 18,
    suggestedIndustry: ["CPG", "Entertainment", "Retail"],
    lastEditBy: "Leslie Alexander",
    lastEditDate: "Mar 28, 2026 23:14",
    summary: "A comprehensive strategy for creating and maintaining a content calendar that focuses on high-visibility topics to maximize brand reach and engagement.",
    content: `<p>The goal of increasing reach and brand awareness is to ensure that more people within the target audience know about the brand and recognize it across various platforms and channels. This involves expanding the brand's visibility, making it more recognizable and memorable to potential customers, and positioning it as a trusted name in its industry.</p>
<p>By increasing reach, the brand connects with a larger audience, including new potential customers who may not have been previously aware of its products or services. Brand awareness ensures that when people think about a product or service category, the brand comes to mind first.</p>`
  },
  {
    id: 2,
    name: "Create an influencer engagement strategy for social media platforms",
    status: "modified",
    active: true,
    bestPracticesCount: 15,
    linkedObjectivesCount: 1,
    suggestedIndustry: ["CPG", "Fashion", "E-commerce"],
    lastEditBy: "Jordan Smith",
    lastEditDate: "Apr 5, 2026 14:36",
    summary: "Strategy for partnering with influencers to boost brand visibility and engagement on social media platforms.",
    content: `<p>Implement a strategy to boost social media engagement through influencer partnerships.</p>`
  },
  {
    id: 3,
    name: "Launch a new product line targeting eco-conscious consumers",
    status: "published",
    active: false,
    bestPracticesCount: 20,
    linkedObjectivesCount: 8,
    suggestedIndustry: ["CPG", "Health & Wellness", "Direct Sales"],
    lastEditBy: "Mia Wong",
    lastEditDate: "Apr 12, 2026 09:45",
    summary: "Plan for designing and launching a sustainable product line for environmentally conscious customers.",
    content: `<p>Design and launch a sustainable product line for environmentally conscious customers.</p>`
  },
  {
    id: 4,
    name: "Conduct market research on emerging consumer trends",
    status: "modified",
    active: true,
    bestPracticesCount: 12,
    linkedObjectivesCount: 2,
    suggestedIndustry: ["CPG", "Technology", "Wholesale"],
    lastEditBy: "Carlos Ramirez",
    lastEditDate: "Apr 15, 2026 11:08",
    summary: "Research initiative to analyze emerging consumer behavior trends for strategic planning purposes.",
    content: `<p>Research and analyze emerging consumer behavior trends for strategic planning.</p>`
  },
  {
    id: 5,
    name: "Implement a loyalty program to increase customer retention",
    status: "draft",
    active: false,
    bestPracticesCount: 10,
    linkedObjectivesCount: 8,
    suggestedIndustry: ["CPG", "Beauty", "Retail"],
    lastEditBy: "Olivia Brown",
    lastEditDate: "Apr 29, 2026 16:15",
    summary: "Development of a customer loyalty program to improve retention and lifetime value.",
    content: `<p>Develop a customer loyalty program to improve retention and lifetime value.</p>`
  },
  {
    id: 6,
    name: "Develop a video marketing strategy for product launches",
    status: "published",
    active: true,
    bestPracticesCount: 8,
    linkedObjectivesCount: null,
    suggestedIndustry: ["CPG", "Sports", "Online"],
    lastEditBy: "Liam Johnson",
    lastEditDate: "Apr 25, 2026 18:00",
    summary: "Video content strategy for upcoming product launch campaigns across multiple platforms.",
    content: `<p>Create video content strategy for upcoming product launch campaigns.</p>`
  },
  {
    id: 7,
    name: "Host a webinar to educate consumers about product benefits",
    status: "published",
    active: true,
    bestPracticesCount: 14,
    linkedObjectivesCount: 6,
    suggestedIndustry: ["CPG", "Food & Beverage", "Event Marketing"],
    lastEditBy: "Sara Patel",
    lastEditDate: "Apr 30, 2026 13:38",
    summary: "Educational webinar series to showcase product features and benefits to potential customers.",
    content: `<p>Plan and host educational webinars to showcase product features and benefits.</p>`
  },
  {
    id: 8,
    name: "Create a cross-promotion strategy with complementary brands",
    status: "modified",
    active: true,
    bestPracticesCount: 22,
    linkedObjectivesCount: 3,
    suggestedIndustry: ["CPG", "Home Goods", "Partnerships"],
    lastEditBy: "Ethan Clark",
    lastEditDate: "May 5, 2026 12:08",
    summary: "Partnership strategy to establish cross-promotional opportunities with complementary brands.",
    content: `<p>Establish cross-promotional partnerships with complementary brands.</p>`
  },
  {
    id: 9,
    name: "Optimize the website for better user experience",
    status: "modified",
    active: true,
    bestPracticesCount: 16,
    linkedObjectivesCount: 4,
    suggestedIndustry: ["CPG", "Travel", "Digital Marketing"],
    lastEditBy: "Isabella Lee",
    lastEditDate: "May 18, 2026 10:45",
    summary: "Website optimization initiative to enhance user engagement and conversion rates.",
    content: `<p>Improve website UX/UI to enhance user engagement and conversion rates.</p>`
  },
  {
    id: 10,
    name: "Analyze customer feedback to enhance product features",
    status: "modified",
    active: true,
    bestPracticesCount: 11,
    linkedObjectivesCount: 2,
    suggestedIndustry: ["CPG", "Automotive", "Research"],
    lastEditBy: "James Taylor",
    lastEditDate: "May 15, 2026 17:00",
    summary: "Feedback analysis program to collect and analyze customer insights for product improvement.",
    content: `<p>Collect and analyze customer feedback to improve product development.</p>`
  },
  {
    id: 11,
    name: "Implement a loyalty program to increase customer retention",
    status: "draft",
    active: false,
    bestPracticesCount: 18,
    linkedObjectivesCount: 0,
    suggestedIndustry: ["CPG", "Beauty", "Retail"],
    lastEditBy: "Olivia Brown",
    lastEditDate: "Apr 20, 2026 16:15",
    summary: "Development of a customer loyalty program to improve retention and lifetime value.",
    content: `<p>Develop a customer loyalty program to improve retention and lifetime value.</p>`
  },
  {
    id: 12,
    name: "Develop a video marketing strategy for product launches",
    status: "published",
    active: false,
    bestPracticesCount: 8,
    linkedObjectivesCount: 0,
    suggestedIndustry: ["CPG", "Sports", "Online"],
    lastEditBy: "Liam Johnson",
    lastEditDate: "Apr 25, 2026 10:00",
    summary: "Video content strategy for upcoming product launch campaigns across multiple platforms.",
    content: `<p>Create video content strategy for upcoming product launch campaigns.</p>`
  },
  {
    id: 13,
    name: "Host a webinar to educate consumers about product benefits",
    status: "published",
    active: true,
    bestPracticesCount: 14,
    linkedObjectivesCount: 6,
    suggestedIndustry: ["CPG", "Food & Beverage", "Event Marketing"],
    lastEditBy: "Sara Patel",
    lastEditDate: "Apr 30, 2026 13:30",
    summary: "Educational webinar series to showcase product features and benefits to potential customers.",
    content: `<p>Plan and host educational webinars to showcase product features and benefits.</p>`
  },
  {
    id: 14,
    name: "Create a cross-promotion strategy with complementary brands",
    status: "modified",
    active: true,
    bestPracticesCount: 22,
    linkedObjectivesCount: 3,
    suggestedIndustry: ["CPG", "Home Goods", "Partnerships"],
    lastEditBy: "Ethan Clark",
    lastEditDate: "May 5, 2026 12:00",
    summary: "Partnership strategy to establish cross-promotional opportunities with complementary brands.",
    content: `<p>Establish cross-promotional partnerships with complementary brands.</p>`
  },
  {
    id: 15,
    name: "Optimize the website for better user experience",
    status: "modified",
    active: true,
    bestPracticesCount: 16,
    linkedObjectivesCount: 4,
    suggestedIndustry: ["CPG", "Travel", "Digital Marketing"],
    lastEditBy: "Isabella Lee",
    lastEditDate: "May 10, 2026 15:45",
    summary: "Website optimization initiative to enhance user engagement and conversion rates.",
    content: `<p>Improve website UX/UI to enhance user engagement and conversion rates.</p>`
  },
  {
    id: 16,
    name: "Implement a loyalty program to increase customer retention",
    status: "draft",
    active: false,
    bestPracticesCount: 18,
    linkedObjectivesCount: 0,
    suggestedIndustry: ["CPG", "Beauty", "Retail"],
    lastEditBy: "Olivia Brown",
    lastEditDate: "Apr 20, 2026 16:15",
    summary: "Development of a customer loyalty program to improve retention and lifetime value.",
    content: `<p>Develop a customer loyalty program to improve retention and lifetime value.</p>`
  },
  {
    id: 17,
    name: "Develop a video marketing strategy for product launches",
    status: "published",
    active: false,
    bestPracticesCount: 8,
    linkedObjectivesCount: 0,
    suggestedIndustry: ["CPG", "Sports", "Online"],
    lastEditBy: "Liam Johnson",
    lastEditDate: "Apr 25, 2026 10:00",
    summary: "Video content strategy for upcoming product launch campaigns across multiple platforms.",
    content: `<p>Create video content strategy for upcoming product launch campaigns.</p>`
  },
  {
    id: 18,
    name: "Host a webinar to educate consumers about product benefits",
    status: "published",
    active: true,
    bestPracticesCount: 14,
    linkedObjectivesCount: 6,
    suggestedIndustry: ["CPG", "Food & Beverage", "Event Marketing"],
    lastEditBy: "Sara Patel",
    lastEditDate: "Apr 30, 2026 13:30",
    summary: "Educational webinar series to showcase product features and benefits to potential customers.",
    content: `<p>Plan and host educational webinars to showcase product features and benefits.</p>`
  },
  {
    id: 19,
    name: "Create a cross-promotion strategy with complementary brands",
    status: "modified",
    active: true,
    bestPracticesCount: 22,
    linkedObjectivesCount: 3,
    suggestedIndustry: ["CPG", "Home Goods", "Partnerships"],
    lastEditBy: "Ethan Clark",
    lastEditDate: "May 5, 2026 12:00",
    summary: "Partnership strategy to establish cross-promotional opportunities with complementary brands.",
    content: `<p>Establish cross-promotional partnerships with complementary brands.</p>`
  },
  {
    id: 20,
    name: "Build an email marketing automation workflow",
    status: "draft",
    active: false,
    bestPracticesCount: 5,
    linkedObjectivesCount: 2,
    suggestedIndustry: ["E-commerce", "Retail", "Digital Marketing"],
    lastEditBy: "Michael Chen",
    lastEditDate: "May 20, 2026 09:30",
    summary: "Automated email marketing workflow to nurture leads and improve conversion rates.",
    content: `<p>Create automated email sequences for lead nurturing and customer engagement.</p>`
  },
  {
    id: 21,
    name: "Develop a social media content strategy for Q3",
    status: "modified",
    active: true,
    bestPracticesCount: 19,
    linkedObjectivesCount: 7,
    suggestedIndustry: ["Fashion", "Beauty", "Entertainment"],
    lastEditBy: "Emma Wilson",
    lastEditDate: "May 22, 2026 14:20",
    summary: "Comprehensive social media content plan for the third quarter with focus on engagement.",
    content: `<p>Plan and execute social media content strategy for Q3 campaigns.</p>`
  },
  {
    id: 22,
    name: "Launch a referral program to acquire new customers",
    status: "published",
    active: true,
    bestPracticesCount: 12,
    linkedObjectivesCount: 4,
    suggestedIndustry: ["Technology", "E-commerce", "Direct Sales"],
    lastEditBy: "David Martinez",
    lastEditDate: "May 25, 2026 11:00",
    summary: "Customer referral program to drive organic growth and customer acquisition.",
    content: `<p>Implement referral incentives to encourage customer word-of-mouth marketing.</p>`
  },
  {
    id: 23,
    name: "Create a podcast series about industry trends",
    status: "draft",
    active: false,
    bestPracticesCount: 7,
    linkedObjectivesCount: 0,
    suggestedIndustry: ["Technology", "Research", "Event Marketing"],
    lastEditBy: "Sophia Anderson",
    lastEditDate: "May 28, 2026 16:45",
    summary: "Podcast content series featuring industry experts and thought leadership.",
    content: `<p>Develop a podcast series to share industry insights and build thought leadership.</p>`
  },
  {
    id: 24,
    name: "Optimize product pages for search engine visibility",
    status: "modified",
    active: true,
    bestPracticesCount: 25,
    linkedObjectivesCount: 5,
    suggestedIndustry: ["E-commerce", "Retail", "Digital Marketing"],
    lastEditBy: "Ryan Thompson",
    lastEditDate: "Jun 1, 2026 10:15",
    summary: "SEO optimization for product pages to improve organic search rankings.",
    content: `<p>Improve product page SEO to increase organic traffic and conversions.</p>`
  }
];

// Best practices for the side panel - matching Figma exactly
const BEST_PRACTICES = [
  {
    id: 1,
    title: "Conduct Audience and Market Research",
    content: "Understand your target audience demographics, preferences, and pain points. Research market trends and competitor strategies to identify opportunities for differentiation."
  },
  {
    id: 2,
    title: "Align Content Calendar with Business Goals",
    content: "Ensure your content calendar directly supports key business objectives. Map content themes to specific goals like brand awareness, lead generation, or customer retention."
  },
  {
    id: 3,
    title: "Identify and Prioritize High-Visibility Topics",
    content: "Focus on topics that have high search volume and social engagement potential. Use keyword research and social listening tools to identify trending subjects in your industry."
  },
  {
    id: 4,
    title: "Plan Content Cadence and Diversity",
    content: "Establish a consistent publishing schedule while maintaining variety in content formats. Mix educational, entertaining, and promotional content to keep your audience engaged."
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TACTICS_DATA, BEST_PRACTICES, INDUSTRIES };
}
