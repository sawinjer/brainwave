import { test, expect } from "@playwright/test";

test.describe("Brainwave App", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Brainwave/i)).toBeVisible();
  });

  test("clicking Create a quiz redirects to quiz creation page", async ({ page }) => {
    await page.goto("/");
    
    const createQuizLink = page.getByRole("link", { name: /create a quiz/i });
    await expect(createQuizLink).toBeVisible();
    
    await createQuizLink.click();
    
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByRole("heading", { name: /creating a quiz/i })).toBeVisible();
  });

  test("filling required fields in quiz creation form and submitting", async ({ page }) => {
    await page.goto("/create");
    
    // Fill in the quiz title
    const titleInput = page.getByLabel(/title/i);
    await titleInput.fill("My Test Quiz");
    
    // Add a question
    const addQuestionButton = page.getByRole("button", { name: /add question/i });
    await addQuestionButton.click();
    
    // Fill in the question
    const questionInput = page.getByPlaceholder(/quesetion/i);
    await questionInput.fill("What is 2+2?");
    
    // Add an answer
    const addAnswerButton = page.getByRole("button", { name: /add answer/i });
    await addAnswerButton.click();
    
    // Fill in the answer
    const answerInput = page.getByPlaceholder(/answer/i);
    await answerInput.fill("4");
    
    // Mark answer as correct
    const isCorrectCheckbox = page.getByLabel(/is correct\?/i);
    await isCorrectCheckbox.check();
    
    // Submit the form
    const submitButton = page.getByRole("button", { name: /submit/i });
    await submitButton.click();
    
    // The form should submit (backend may fail but form should be valid)
    // Check that the submit button is disabled after submission attempt
    await expect(submitButton).toBeDisabled();
  });

  test("quiz creation form shows error when no questions added", async ({ page }) => {
    await page.goto("/create");
    
    // Fill in the quiz title only
    const titleInput = page.getByLabel(/title/i);
    await titleInput.fill("Quiz without questions");
    
    // Submit the form without adding any questions
    const submitButton = page.getByRole("button", { name: /submit/i });
    await submitButton.click();
    
    // Should show error alert
    await expect(page.getByText(/no valid questions/i)).toBeVisible();
  });
});
