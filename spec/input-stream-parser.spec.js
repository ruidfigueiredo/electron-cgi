const InputStreamParser = require('../tab-separated-input-stream-parser');

describe('Tab separated input stream parser', () => {
    describe('.addPartial(str)', () => {
        beforeEach(() => {
            this.parser = new InputStreamParser();
        });

        it('empty string onResponse handler does not get invoked', () =>{            
            let result = null;
            this.parser.onResponse(response => { result = response; });

            this.parser.addPartial('');

            expect(result).toBeNull();
        });

        it('partial response string onResponse handler does not get invoked', () =>{            
            let result = null;
            this.parser.onResponse(response => { result = response; });

            this.parser.addPartial('{"id": 42');

            expect(result).toBeNull();
        });        

        it('valid complete json response string without separator onResponse handler does not get invoked', () =>{            
            let result = null;
            this.parser.onResponse(response => { result = response; });

            this.parser.addPartial('{"id": 42}');

            expect(result).toBeNull();
        });        

        it('valid complete json response string with separator onResponse handler gets called with response object', () =>{            
            let result = null;
            this.parser.onResponse(response => { result = response; });

            this.parser.addPartial('{"type": "RESPONSE", "response": {"id": 42}}\t');

            expect(result).toEqual({id: 42});
        });
        
        it('invalid complete json response string with separator onResponse throws error', () =>{            
            expect(() => this.parser.addPartial('{{`|`}: 42}\t')).toThrowError("Invalid incoming JSON: {{`|`}: 42}");            
        });

        it('two valid complete json response strings with separator, onResponse handler gets called twice with correct response objects', () =>{            
            let result = [];
            this.parser.onResponse(response => { result.push(response); });

            this.parser.addPartial('{"type": "RESPONSE", "response": {"id": 42}}\t{"type": "RESPONSE", "response":{"id": 24}}\t');

            expect(result.length).toBe(2);
            expect(result[0]).toEqual({id: 42});
            expect(result[1]).toEqual({id: 24});
        }); 
        
        it('two separate valid complete json response strings with separator, onResponse handler gets called twice with correct response objects', () =>{            
            let result = [];
            this.parser.onResponse(response => { result.push(response); });

            this.parser.addPartial('{"type": "RESPONSE", "response": {"id": 42}');
            this.parser.addPartial('}\t{"type": "RESPONSE", "response": ');
            this.parser.addPartial('{"id": 24}}\t');

            expect(result.length).toBe(2);
            expect(result[0]).toEqual({id: 42});
            expect(result[1]).toEqual({id: 24});
        });         


        //TODO: (RF) add tests for requests
    });
});