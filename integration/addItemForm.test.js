describe("addItemForm", () => {
  it("base example, visually looks correct", async () => {
    // APIs from jest-puppeteer
    //@type-ignore
    await page.goto(
      "http://localhost:6006/iframe.html?args=&id=todolists-additemform--add-item-form-story&viewMode=story",
      { waitUntil: "networkidle2" },
    );

    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});
