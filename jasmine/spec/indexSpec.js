describe ("Mox Modules Application", () => {
    const elementWithText = "<p>Element text</p>";
    const moduleWithSubmodules = {
        "id": 2,
        "name": "B",
        "features": "mPCIe",
        "submodules": [
            {
                "id": 3,
                "name": "W",
                "features": "Wi-Fi, MIMO 3x3"
            }
        ]
    };
    const labelWithCheckbox = `<label class="modules">` +
                                    `${moduleWithSubmodules.name}` +
                                    `<input type="checkbox" id="${moduleWithSubmodules.id}" value="${moduleWithSubmodules.name}">` +
                                `</label>`;
    const moduleElementWithSubmodules = `<div class="modulesDiv">` +
                                            labelWithCheckbox +
                                            `<p class="submodules">Submodules of ${moduleWithSubmodules.name}</p>` +
                                            `<label class="submodules">` +
                                                `${moduleWithSubmodules.submodules[0].name}` +
                                                `<input type="checkbox" id="${moduleWithSubmodules.submodules[0].id}" value="${moduleWithSubmodules.submodules[0].name}">` +
                                            `</label>`+
                                        `</div>`;

    it("should be able to create an element with text", () => {
        expect(createElementWithText("p", "Element text").outerHTML).toEqual(elementWithText);
    });

    it("should be able to create a label with a checkbox", () => {
        expect(createLabel(moduleWithSubmodules).outerHTML).toEqual(labelWithCheckbox);
    });

    it("should be able to create a module element with submodules", () => {
        expect(createModuleWithSubmodulesItem(moduleWithSubmodules).outerHTML).toEqual(moduleElementWithSubmodules);
    });
});