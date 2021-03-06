describe('Test Profile', () => {
    beforeAll(async () => {
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('test@mail.com');
        await element(by.id('UserPwd')).typeText('password');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
        await element(by.id('invitationButton')).tap();
    });

    test('should render invitation page', async () => {
        await expect(element(by.id('searchUserButton'))).toBeVisible();
    });

    test('shoule render invitations', async () => {
        await expect(element(by.id('Apple'))).toBeVisible();
        await expect(element(by.id('Banana'))).toBeVisible();
        await expect(element(by.id('Sushi'))).toBeVisible();
    });

    test('should render project detail page', async() => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('projectNameButton'))).toBeVisible();
        await expect(element(by.id('projectStartDateButton'))).toBeVisible();
        await expect(element(by.id('projectEndDateButton'))).toBeVisible();
        await expect(element(by.id('memberButton'))).toBeVisible();
        await expect(element(by.id('eventButton'))).toBeVisible();
    });

    test('should not show start date pickers', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('startDatePicker'))).toBeNotVisible();
        await element(by.id('projectStartDateButton')).tap();
        await expect(element(by.id('startDatePicker'))).toBeNotVisible();
    });

    test('should not show end date pickers', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('endDatePicker'))).toBeNotVisible();
        await element(by.id('projectEndDateButton')).tap();
        await expect(element(by.id('endDatePicker'))).toBeNotVisible();
    });

    test('should not show members', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
        await element(by.id('memberButton')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
    });

    test('should not show events', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
        await element(by.id('eventButton')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
    });

    afterAll(async() => {
        await device.reloadReactNative();
        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    });
});