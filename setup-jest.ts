import 'jest-preset-angular/setup-jest';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// Mock console.error to suppress error messages in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  });
});