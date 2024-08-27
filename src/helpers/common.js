export const supaBaseUrl = "https://dksijhqnltotvjwcutcc.supabase.co";
export const supaBaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrc2lqaHFubHRvdHZqd2N1dGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1MzgwODQsImV4cCI6MjAzODExNDA4NH0.CKF1LyY4CvvGf79gfHkZJa199pzL9AFdvUSfelBB1_I";


export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>?/gm, "");
}