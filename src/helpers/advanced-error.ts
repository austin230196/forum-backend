class AdvancedError extends Error {
    public constructor(
        public message: string,
        public status: number
    ){
        super(message);
    }
}



export default AdvancedError;