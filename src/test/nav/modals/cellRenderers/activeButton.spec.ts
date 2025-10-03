import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveBtnCellRendererComponent } from 'src/app/component/nav/thresholdModal/cellRenderers/activeBtnCellRenderer.component';
import { ChangeDetectorRef } from '@angular/core';

describe('ActiveBtnCellRendererComponent', () => {
  let component: ActiveBtnCellRendererComponent;
  let fixture: ComponentFixture<ActiveBtnCellRendererComponent>;
  let changeDetectorRefMock: jest.Mocked<ChangeDetectorRef>;

  beforeEach(async () => {
    changeDetectorRefMock = {
      detectChanges: jest.fn(),
    } as unknown as jest.Mocked<ChangeDetectorRef>;

    await TestBed.configureTestingModule({
      declarations: [ActiveBtnCellRendererComponent],
      providers: [{ provide: ChangeDetectorRef, useValue: changeDetectorRefMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveBtnCellRendererComponent);
    component = fixture.componentInstance;
    component.params = { value: 'false', data: { id: 123 }, onClick: jest.fn() };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize params and isActive property in agInit', () => {
    const mockParams = { value: 'true', data: { id: 123 }, onClick: jest.fn() };
    component.agInit(mockParams);
  
    expect(component.params).toEqual(mockParams);
    expect(component.isActive).toBe('true');
  });

  it('should initialize isActive to false by default', () => {
    expect(component.isActive).toBe('false');
  });

  it('should set isActive to true when setAsActive is called', () => {
    component.setAsActive();
    expect(component.isActive).toBe('true');
  });

  it('should call onClick with id and true when setAsActive is called', () => {
    component.setAsActive();
    expect(component.params.onClick).toHaveBeenCalledWith(123, true);
  });

  it('should set isActive to false when setAsDeactive is called', () => {
    component.params.value = 'true';
    component.setAsDeactive();
    expect(component.isActive).toBe('false');
  });

  it('should call onClick with id and false when setAsDeactive is called', () => {
    component.params.value = 'true';
    component.setAsDeactive();
    expect(component.params.onClick).toHaveBeenCalledWith(123, false);
  });

  it('should not refresh the component', () => {
    const result = component.refresh({});
    expect(result).toBe(false);
  });
});
