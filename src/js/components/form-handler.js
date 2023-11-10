import { modules } from '@js/base/modules';

export class FormHandler {
	constructor(
		options = { viewPass: true, autoHeight: true, formSubmit: true },
	) {
		this.options = options;
		this.forms = document.forms;
		this.init();
	}

	init() {
		this.formFieldsInit();
		if (this.options.formSubmit) this.formSubmit();
	}

	formFieldsInit() {
		//focus in
		document.body.addEventListener('focusin', (e) => {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
				e.target.setAttribute('aria-current', 'true');
				if (e.target.hasAttribute('data-validate'))
					this.formValidate.removeError(e.target);
			}
		});

		//focus out
		document.body.addEventListener('focusout', (e) => {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
				e.target.setAttribute('aria-current', 'false');
				if (e.target.hasAttribute('data-validate'))
					this.formValidate.validateInput(e.target);
			}
		});

		if (this.options.viewPass) {
			document.addEventListener('click', (e) => {
				if (e.target.closest('[data-type-toggle]')) {
					let inputType = Boolean(e.target.dataset.typeToggle === 'true')
						? 'password'
						: 'text';

					e.target.parentElement
						.querySelector('input')
						?.setAttribute('type', inputType);

					e.target.dataset.typeToggle = Boolean(
						e.target.dataset.typeToggle !== 'true',
					);
				}
			});
		}

		if (this.options.autoHeight) {
			const textareas = document.querySelectorAll('textarea[data-autoheight]');
			if (textareas.length) {
				textareas.forEach((textarea) => {
					const [minHeight, maxHeight] = textarea.dataset.autoheight
						.split(',')
						.map(Number);
					const startHeight = isNaN(minHeight)
						? Number(textarea.offsetHeight)
						: Math.max(Number(textarea.offsetHeight), minHeight);
					textarea.style.height =
						Math.min(
							Math.max(textarea.scrollHeight, startHeight),
							maxHeight || Infinity,
						) + 'px';
					textarea.addEventListener('input', () => {
						console.log(textarea.scrollHeight, startHeight, maxHeight);
						if (textarea.scrollHeight > startHeight) {
							textarea.style.height = `auto`;
							textarea.style.height =
								Math.min(
									Math.max(textarea.scrollHeight, startHeight),
									maxHeight || Infinity,
								) + 'px';
						}
					});
				});
			}
		}
	}

	formValidate = {
		getErrors(form) {
			let errorCount = 0;
			let formRequiredItems = form.querySelectorAll('*[data-required]');
			if (formRequiredItems.length) {
				formRequiredItems.forEach((formRequiredItem) => {
					if (
						(formRequiredItem.offsetParent !== null ||
							formRequiredItem.tagName === 'SELECT') &&
						!formRequiredItem.disabled
					) {
						errorCount += this.validateInput(formRequiredItem);
					}
				});
			}
			return errorCount;
		},
		// Validates the input of a form item and returns the number of errors found
		validateInput(formRequiredItem) {
			let errorCount = 0;

			// If the form item is an email input, validate the email format
			if (formRequiredItem.dataset.required === 'email') {
				formRequiredItem.value = formRequiredItem.value.replace(' ', '');
				if (this.emailTest(formRequiredItem)) {
					this.addError(formRequiredItem);
					errorCount++;
				} else {
					this.removeError(formRequiredItem);
				}
			}
			// If the form item is a checkbox, make sure it's checked
			else if (
				formRequiredItem.type === 'checkbox' &&
				!formRequiredItem.checked
			) {
				this.addError(formRequiredItem);
				errorCount++;
			}
			// Otherwise, make sure the form item has a value
			else {
				if (!formRequiredItem.value.trim()) {
					this.addError(formRequiredItem);
					errorCount++;
				} else {
					this.removeError(formRequiredItem);
				}
			}

			return errorCount;
		},
		addError(formRequiredItem) {
			formRequiredItem.setAttribute('aria-invalid', 'true');
		},
		removeError(formRequiredItem) {
			formRequiredItem.setAttribute('aria-invalid', 'false');
		},
		formClean(form) {
			form.reset();

			setTimeout(() => {
				let inputs = form.querySelectorAll('input,textarea');
				inputs.forEach((el) => {
					el.parentElement.classList.remove('_form-focus');
					el.classList.remove('_form-focus');
					this.removeError(el);
				});

				let checkboxes = form.querySelectorAll('type="checkbox"');
				if (checkboxes.length > 0) {
					checkboxes.forEach((checkbox) => {
						checkbox.checked = false;
					});
				}

				if (modules.select) {
					let selects = form.querySelectorAll('.select');
					if (selects.length) {
						selects.forEach((select) => {
							modules.select.selectBuild(select.querySelector('select'));
						});
					}
				}
			}, 0);
		},
		emailTest(formRequiredItem) {
			return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
				formRequiredItem.value,
			);
		},
	};

	formSubmit() {
		if (this.forms.length) {
			for (const form of this.forms) {
				form.addEventListener('submit', (e) => {
					const form = e.target;
					this.formSubmitAction(form, e);
				});
				form.addEventListener('reset', (e) => {
					const form = e.target;
					this.formValidate.formClean(form);
				});
			}
		}
	}

	async formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate')
			? this.formValidate.getErrors(form)
			: 0;

		if (error === 0) {
			if (form.hasAttribute('data-ajax')) {
				e.preventDefault();
				const formAction = form.getAttribute('action')
					? form.getAttribute('action').trim()
					: '#';
				const formMethod = form.getAttribute('method')
					? form.getAttribute('method').trim()
					: 'GET';
				const formData = new FormData(form);

				form.classList.add('_sending');

				const response = await fetch(formAction, {
					method: formMethod,
					body: formData,
				});

				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove('_sending');
					this.formSent(form, responseResult);
				} else {
					alert('Помилка');
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {
				e.preventDefault();
				this.formSent(form);
			}
		} else {
			e.preventDefault();
		}
	}

	formSent(form, responseResult = ``) {
		document.dispatchEvent(
			new CustomEvent('formSent', {
				detail: {
					form: form,
				},
			}),
		);

		setTimeout(() => {
			if (modules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? modules.popup.open(popup) : null;
			}
		}, 0);

		setTimeout(() => {
			if (modules.modal) modules.contactFormSuccessModal.showModal();
		}, 0);

		this.formValidate.formClean(form);
	}
}

modules.formHandler = new FormHandler();
