const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('должен вернуть ошибку при передаче строки вместо числа', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: '15'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
    it('должен вернуть ошибку при передаче числа вместо строки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 5,
        },
      });

      const errors = validator.validate({name: 4});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });
    it('должен вернуть ошибку при передаче другого типа вместо строки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 5,
        },
      });

      const errors = validator.validate({name: null});
      const errors2 = validator.validate({name: ()=>{}});

      expect(errors).to.have.length(1);
      expect(errors2).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors2[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got object');
      expect(errors2[0]).to.have.property('error').and.to.be.equal('expect string, got function');
    });

    it('должен вернуть Error при передаче неизвестного типа', () => {
      const validator = new Validator({
        name: {
          type: 'object',
          min: 1,
          max: 5,
        },
      });

      expect( () => validator.validate({name: {}})).to.throw('Unexpected type. Expect "string" or "number", got object');
    });
    it('должен вернуть ошибку о короткой/длинной строке', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 5,
        },
      });

      const errorsShort = validator.validate({name: 'La'});
      const errorsLong = validator.validate({name: 'Lalalalala'});

      expect(errorsShort).to.have.length(1);
      expect(errorsLong).to.have.length(1);
      expect(errorsShort[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsLong[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsShort[0]).to.have.property('error').and.to.be.equal('too short, expect 3, got 2');
      expect(errorsLong[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 10');
    });

    it('должен вернуть ошибку о маленьком/большом числе', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 25,
        },
      });

      const errorsMin = validator.validate({age: 8});
      const errorsMax = validator.validate({age: 70});

      expect(errorsMin).to.have.length(1);
      expect(errorsMax).to.have.length(1);
      expect(errorsMin[0]).to.have.property('field').and.to.be.equal('age');
      expect(errorsMax[0]).to.have.property('field').and.to.be.equal('age');
      expect(errorsMin[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 8');
      expect(errorsMax[0]).to.have.property('error').and.to.be.equal('too big, expect 25, got 70');
    });

    it('должен вернуть ошибку о маленьком/большом числе с отрицательными', () => {
      const validator = new Validator({
        someField: {
          type: 'number',
          min: -10,
          max: -5,
        },
      });

      const errorsMin = validator.validate({someField: -20});
      const errorsMax = validator.validate({someField: -2});

      expect(errorsMin).to.have.length(1);
      expect(errorsMax).to.have.length(1);
      expect(errorsMin[0]).to.have.property('field').and.to.be.equal('someField');
      expect(errorsMax[0]).to.have.property('field').and.to.be.equal('someField');
      expect(errorsMin[0]).to.have.property('error').and.to.be.equal('too little, expect -10, got -20');
      expect(errorsMax[0]).to.have.property('error').and.to.be.equal('too big, expect -5, got -2');
    });

    it('должен вернуть несколько ошибок', () => {
      const validator = new Validator({
        someField: {
          type: 'number',
          min: 0,
          max: 5,
        },
        name: {
          type: 'string',
          min: 2,
          max: 7,
        },
      });

      const errors = validator.validate({someField: 10, name: 'a'});


      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.oneOf(['someField', 'name']);
      expect(errors[1]).to.have.property('field').and.to.be.oneOf(['someField', 'name']);
      expect(errors[1].field).not.to.be.equal(errors[0].field);
    });

    it('должен провалидировать без ошибок', () => {
      const validator = new Validator({
        someField: {
          type: 'number',
          min: 1,
          max: 5,
        },
        name: {
          type: 'string',
          min: 0,
          max: 7,
        },
      });

      const errors = validator.validate({someField: 3, name: ''});


      expect(errors).to.have.length(0);
    });
  });
});
