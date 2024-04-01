import addFunction from "../utils/add-function.util"


describe("test add function", () => {
    it('adds two numbers and returns the sum', async () => {
        let sum = addFunction(5, 4);
        expect(sum).toBe(10);
    })
})