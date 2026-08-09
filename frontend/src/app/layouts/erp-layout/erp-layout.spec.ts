import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ErpLayout } from "./erp-layout";

describe("ErpLayout", () => {
  let component: ErpLayout;
  let fixture: ComponentFixture<ErpLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErpLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ErpLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
