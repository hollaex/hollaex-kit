'use strict';
const TABLE = 'Statuses';
const COLUMN = 'email';

// WITHDRAWAL_REQUEST
let withdrawal_request_en = JSON.stringify({
	'html': '<div><p> Dear ${name} </p><p>You have made a ${currency} withdrawal request of ${amount} to ${address}<br /><br />Amount: ${amount} ${currency}<br />Fee: ${fee} ${fee_coin}<br />Address: ${address}<br /><span id="network">Network: ${network}</span><br /><br />In order to confirm this withdrawal, please click the button below.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Confirm</Button></a></div><p>If this request was made in error, it is safe to ignore it; no changes will be made to your account.</p><p>Request initiated from: ${ip}</p><p> Regards<br> ${api_name} team </p></div>',
	'title': '${currency} Withdrawal Request'
});
let withdrawal_request_ar = JSON.stringify({
	'html': '<div><p> ${name}العزيز </p><p>لقد قدّمت طلب سحب${currency} بمبلغ ${amount} الى ${address}<br /><br />المبلغ: ${amount} ${currency}<br />الرسوم: ${fee} ${fee_coin}<br />العنوان: ${address}<br /><span id="network">شبكة الاتصال: ${network}</span><br /><br />لتأكيد هذا السحب ، انقر على الزر أدناه.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">أيٍّد</Button></a></div><p>إذا تم تقديم هذا الطلب عن طريق الخطأ ، فمن الآمن تجاهله ؛ لن يتم إجراء أي تغييرات في حسابك.</p><p>تم بدء الطلب من: ${ip}</p><p> تحية<br> فريق${api_name} </p></div>',
	'title': '${currency} سحب  طلب'
});
let withdrawal_request_de = JSON.stringify({
	'html': '<div><p> Sehr geehrte/r ${name} </p><p>Sie haben einen ${currency} Auszahlungsantrag von ${amount} an die Adresse ${address} gemacht<br /><br />Betrag: ${amount} ${currency}<br />Gebühr: ${fee} ${fee_coin}<br />Adresse: ${address}<br /><span id="network">Netzwerk: ${network}</span><br /><br />Um diese Auszahlung zu bestätigen, klicken Sie bitte auf die Taste unten.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Bestätigen</Button></a></div><p>Wenn diese Anfrage fälschlicherweise gestellt wurde, können Sie sie getrost ignorieren; es werden keine Änderungen an Ihrem Konto vorgenommen.</p><p>Anfrage initiiert von: ${ip}</p><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>',
	'title': '${currency} Abbuchung Anfrage'
});
let withdrawal_request_es = JSON.stringify({
	'html': '<div><p> Estimado/ Estimada ${name} </p><p>You have made a ${currency} withdrawal request of ${amount} to ${address}<br /><br />Cantidad: ${amount} ${currency}<br />Fee: ${fee} ${fee_coin}<br />Dirección: ${address}<br /><span id="network">La red: ${network}</span><br /><br />In order to confirm this withdrawal, please click the button below.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Confirm</Button></a></div><p>Si esta solicitud se hizo por error, es seguro ignorarla; no se harán cambios en su cuenta.</p><p>Solicitud iniciada de: ${ip}</p><p> Saludos<br>Equipo de  ${api_name}  </p></div>',
	'title': '${currency} Retirada Request'
});
let withdrawal_request_fa = JSON.stringify({
	'html': '<div><p>  کاربر عزیز${name} </p><p>شما درخواست برداشت ${currency} و به مبلغ ${amount} به آدرس ${address}نموده اید.<br /><br />مبلغ: ${amount} ${currency}<br />کارمزد: ${fee} ${fee_coin}<br />آدرس: ${address}<br /><span id="network">شبکه: ${network}</span><br /><br />برای تایید برداشت خود ،دکمه زیر فشار دهید.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">تایید</Button></a></div><p>اگر این درخواست را باشتباه صادر کرده اید می توانید براحتی آن را ملغی کنید بدون آنکه نگران تغییر در حساب کاربری خود باشید.</p><p>درخواست ارسالی از : ${ip}</p><p> با تشکر<br> ${api_name} تیم </p></div>',
	'title': '${currency} برداشت درخواست'
});
let withdrawal_request_fr = JSON.stringify({
	'html': '<div><p> Bonjour ${name} </p><p>Vous avez fait une demande de retrait ${currency} d un montant de ${amount} à l adresse suivante  ${address}<br /><br />Montant: ${amount} ${currency}<br />Frais: ${fee} ${fee_coin}<br />Addresse: ${address}<br /><span id="network">Réseau: ${network}</span><br /><br />Pour confirmer le retrait, veuillez cliquer dur le bouton ci-dessous.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Confirmer</Button></a></div><p>Si cette demande a été faite par erreur, il est prudent de l ignorer; aucune modification ne sera apportée à votre compte.</p><p>Demande initiée depuis: ${ip}</p><p> Bien cordialement<br> ${api_name} team </p></div>',
	'title': '${currency} Retrait Demande'
});
let withdrawal_request_id = JSON.stringify({
	'html': '<div><p> Kepada ${name} </p><p>Anda telah membuat permintaan penarikan ${currency} dengan jumlah ${amount} ke ${address}<br /><br />Jumlah: ${amount} ${currency}<br />Biaya: ${fee} ${fee_coin}<br />Alamat: ${address}<br /><span id="network">Jaringan: ${network}</span><br /><br />Untuk konfirmasi penarikan ini, silakan klik tombol di bawah.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Konfirmasi</Button></a></div><p>Jika Anda tidak ingin melanjutkan permintaan ini, silakan abaikan ini; tidak ada perubahan pada akun Anda.</p><p>Permintaan dari: ${ip}</p><p> Salam<br> ${api_name} tim </p></div>',
	'title': '${currency} Penarikan Permintaan'
});
let withdrawal_request_ja = JSON.stringify({
	'html': '<div><p> ${name}様 </p><p>お客様のアカウントから${address}へ${amount} ${currency}出金がリクエストされました。<br /><br />金額： ${amount} ${currency}<br />手数料： ${fee} ${fee_coin}<br />アドレス： ${address}<br /><span id="network">ネットワーク: ${network}</span><br /><br />出金を承認するためには、下のボタンをクリックしてください。<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">出金承認</Button></a></div><p>このリクエストの続行を望まない場合、このメールは無視してください。お客様のアカウントに変更は一切適用されません。</p><p>リクエスト元： ${ip}</p><p> 敬具<br> ${api_name} チーム </p></div>',
	'title': '${currency} 出金 リクエスト'
});
let withdrawal_request_ko = JSON.stringify({
	'html': '<div><p> ${name}님 </p><p>회원님은 ${address} 로 ${amount} 의 ${currency}을 출금요청하였습니다.<br /><br />금액: ${amount} ${currency}<br />수수료: ${fee} ${fee_coin}<br />주소: ${address}<br /><span id="network">회로망: ${network}</span><br /><br />출금 요청을 완료하시려면 아래버튼을 클릭해주시기 바랍니다.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">나의 계정 활성화</Button></a></div><p>만약 이 요청을 원하지 않는다면, 회원님의 계정에는 변경사항이 없으니 본 메일을 무시해 주시기 바랍니다.</p><p>요청하신곳: ${ip}</p><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>',
	'title': '${currency} 출금 요청'
});
let withdrawal_request_pt = JSON.stringify({
	'html': '<div><p> Dear ${name} </p><p>Você fez uma solicitação de saque de ${currency} de ${amount} para ${address}<br /><br />Quantia: ${amount} ${currency}<br />Taxa: ${fee} ${fee_coin}<br />Endereço: ${address}<br /><span id="network">Rede: ${network}</span><br /><br />Para confirmar este saque, por favor clique no botão abaixo.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Confirmar</Button></a></div><p>Se esta solicitação foi feita por engano, gentileza ignorá-la; nenhuma alteração será feita em sua conta.</p><p>Solicitação iniciada em: ${ip}</p><p> Saudações<br> ${api_name} equipe </p></div>',
	'title': '${currency} Saque Solicitação'
});
let withdrawal_request_vi = JSON.stringify({
	'html': '<div><p> ${name} thân mến </p><p>Quý khách vừa thực hiện yêu cầu rút ${currency} với số lượng ${amount} tới ${address}<br /><br />Số lượng: ${amount} ${currency}<br />Phí: ${fee} ${fee_coin}<br />Địa chỉ: ${address}<br /><span id="network">Mạng: ${network}</span><br /><br />Để xác nhận yêu cầu rút tiền này, vui lòng nhấn vào nút bên dưới.<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">Xác nhận</Button></a></div><p>Trong trường hợp không mong muốn thay đổi nêu trên, hãy bỏ qua tin nhắn này. Chúng tôi sẽ không thực hiện bất kỳ thay đổi nào trên tài khoản của quý khách.</p><p>Yêu cầu được gửi đến từ: ${ip}</p><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>',
	'title': 'Yêu cầu ${currency} Rút tiền'
});
let withdrawal_request_zh = JSON.stringify({
	'html': '<div><p> ${name} </p><p>你已提出${currency}提款申请，金额为${amount}至${address}。<br /><br />金额: ${amount} ${currency}<br />手续费: ${fee} ${fee_coin}<br />地址: ${address}<br /><span id="network">网络: ${network}</span><br /><br />为完成此次提款申请，请点击下方按钮。<br /></p><div style="padding-top: 10px; margin-bottom: 10px;"><a href="${link}" target="_blank"><Button style="cursor: pointer; background-color: #333333; color: white; border: none; padding: 1rem; text-transform: uppercase; cursor: pointer !important; font-size: 14px; min-width: 11rem;">确认</Button></a></div><p>如果该请求是错误的，请忽略，并且你的账号不会有任何改变</p><p>提出申请的出处: ${ip}</p><p> 感谢你的使用<br> ${api_name} 团队 </p></div>',
	'title': '${currency} 提款 申请'
});


// WITHDRAWAL_COMPLETED
let withdrawal_completed_en = JSON.stringify({
	'html': '<div><p> Dear ${name} </p><p>Your withdrawal request for ${amount} ${currency} is processed.</p><p>Amount: ${amount} ${currency}<br />Fee: ${fee} ${fee_coin}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id="network">Network: ${network}</span><br /><ul>${explorers}</ul><p> Regards<br> ${api_name} team </p></div>',
	'title': '${currency} withdrawal completed'
});
let withdrawal_completed_ar = JSON.stringify({
	'html': '<div><p> ${name}العزيز </p><p>تمت معالجة طلب سحبك بمبلغ ${amount} ${currency} و نقله إلى عنوان.${address}. </p><p>المبلغ: ${amount} ${currency}<br />الرسوم: ${fee} ${fee_coin}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id="network">شبكة الاتصال: ${network}</span><br /><ul>${explorers}</ul><p> تحية<br> فريق${api_name} </p></div>',
	'title': '${currency} سحب completed'
});
let withdrawal_completed_de = JSON.stringify({
	'html': '<div><p> Sehr geehrte/r ${name} </p><p>Ihr Auszahlungsantrag für ${amount} ${currency} wurde bearbeitet.</p><p>Betrag: ${amount} ${currency}<br />Gebühr: ${fee} ${fee_coin}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id="network">Netzwerk: ${network}</span><br /><ul>${explorers}</ul><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>',
	'title': '${currency} Abbuchung completed'
});
let withdrawal_completed_es = JSON.stringify({
	'html': '<div><p> Estimado/ Estimada ${name} </p><p>Su solicitud de retirada de ${amount} ${currency} se está procesando.</p><p>Cantidad: ${amount} ${currency}<br />Tarifa: ${fee} ${fee_coin}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacciónID: ${transaction_id}<br /><span id="network">La red: ${network}</span><br /><ul>${explorers}</ul><p> Saludos<br>Equipo de  ${api_name}  </p></div>',
	'title': '${currency} Retirada completed'
});
let withdrawal_completed_fa = JSON.stringify({
	'html': '<div><p> کاربر عزیز${name} </p><p>درخواست برداشت شما به مبلغ ${amount} ${currency} درحال انجام و ارسال به آدرس ${address} می باشد.<br />کارمزد: ${fee} ${fee_coin}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id="network">شبکه: ${network}</span><br /><ul>${explorers}</ul><p> Regards<br> ${api_name} team </p></div>',
	'title': '${currency} برداشت completed'
});
let withdrawal_completed_fr = JSON.stringify({
	'html': '<div><p> Bonjour ${name} </p><p>Votre demande de retrait de ${amount} ${currency} est traité.</p><p>Montant: ${amount} ${currency}<br />Frais: ${fee} ${fee_coin}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id="network">Réseau: ${network}</span><br /><ul>${explorers}</ul><p> Bien cordialement<br> ${api_name} team </p></div>',
	'title': '${currency} withdrawal completed'
});
let withdrawal_completed_id = JSON.stringify({
	'html': '<div><p>Kepada ${name} </p><p>Permintaan penarikan Anda untuk ${amount} ${currency} telah diproses dan ditransfer ke alamat ${address}.</p><p>Jumlah: ${amount} ${currency}<br />Biaya: ${fee} ${fee_coin}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id="network">Jaringan: ${network}</span><br /><ul>${explorers}</ul><p> Salam<br> ${api_name} tim </p></div>',
	'title': '${currency} Penarikan completed'
});
let withdrawal_completed_ja = JSON.stringify({
	'html': '<div><p> ${name}様 </p><p>お客様の${amount} ${currency}出金が完了し、アドレス${address}に振り込みされました。</p><p>金額: ${amount} ${currency}<br />手数料: ${fee} ${fee_coin}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id="network">ネットワーク: ${network}</span><br /><ul>${explorers}</ul><p> 敬具<br> ${api_name} チーム </p></div>',
	'title': '${currency}の引き出しが完了しました'
});
let withdrawal_completed_ko = JSON.stringify({
	'html': '<div><p> ${name}님 </p><p>회원님의 ${amount} ${currency}를 출금이 완료되어 회원님의 계좌로 이체되었습니다.</p><p>금액: ${amount} ${currency}<br />수수료: ${fee} ${fee_coin}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id="network">회로망: ${network}</span>>br /><ul>${explorers}</ul><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>',
	'title': '${currency} 출금 완료'
});
let withdrawal_completed_pt = JSON.stringify({
	'html': '<div><p> Dear ${name} </p><p>Sua solicitação de saque de ${amount} ${currency} foi processada e transferida para o endereço ${address}.</p><p>Quantia: ${amount} ${currency}<br />Taxa: ${fee} ${fee_coin}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id="network">Rede: ${network}</span><br /><ul>${explorers}</ul><p> Saudações<br> ${api_name} equipe </p></div>',
	'title': '${currency} Saque concluído'
});
let withdrawal_completed_vi = JSON.stringify({
	'html': '<div><p> ${name} thân mến </p><p>Yêu cầu rút ${amount} ${currency} của quý khách đã được thực hiện và số tiền tương ứng đã được chuyển thành công tới địa chỉ ${address}.</p><p>Số lượng: ${amount} ${currency}<br />Phí: ${fee} ${fee_coin}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id="network">Mạng: ${network}</span><br /><ul>${explorers}</ul><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>',
	'title': '${currency} Rút tiền hoàn thành'
});
let withdrawal_completed_zh = JSON.stringify({
	'html': '<div><p> ${name} </p><p>你的${amount} ${currency}已向该地址${address}提款完毕。</p><p>金额: ${amount} ${currency}<br />手续费: ${fee} ${fee_coin}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id="network">网络: ${network}</span><br /><ul>${explorers}</ul><p> 感谢你的使用<br> ${api_name} 团队 </p></div>',
	'title': '${currency} 提款完成'
});


// WITHDRAWAL_PENDING
let withdrawal_pending_en = JSON.stringify({
	'html': '<div><p> Dear ${name} </p><p>You made a withdrawal request for ${amount} ${currency}. Your withdrawal status is pending and will be processed shortly.</p><p>Amount: ${amount} ${currency}<br />Fee: ${fee} ${fee_coin}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id="network">Network: ${network}</span><br /><ul>${explorers}</ul><p> Regards<br> ${api_name} team </p></div>',
	'title': '${currency} withdrawal pending'
});
let withdrawal_pending_ar = JSON.stringify({
	'html': '<div><p> ${name}العزيز </p><p>لقد قدمت طلب سحب بمبلغ ${amount} ${currency} إلى عنوان. ${address}. حالة السحب الخاصة بك في قيد الإنتظار وستتم معالجتها قريبًا.</p><p>المبلغ: ${amount} ${currency}<br />الرسوم: ${fee} ${fee_coin}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id="network">شبكة الاتصال: ${network}</span><br /><ul>${explorers}</ul><p> تحية<br> فريق${api_name} </p></div>',
	'title': '${currency} سحب request'
});
let withdrawal_pending_de = JSON.stringify({
	'html': '<div><p> Sehr geehrte/r ${name} </p><p>Sie haben eine Auszahlungsanforderung für ${amount} ${currency} gemacht. Ihr Auszahlungsstatus ist ausstehend und wird in Kürze bearbeitet.</p><p>Betrag: ${amount} ${currency}<br />Gebühr: ${fee} ${fee_coin}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id="network">Netzwerk: ${network}</span><br /><ul>${explorers}</ul><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>',
	'title': '${currency} Abbuchung request'
});
let withdrawal_pending_es = JSON.stringify({
	'html': '<div><p> Estimado/ Estimada ${name} </p><p>Usted hizo una solicitud de retiro de ${amount} ${currency}. El estado de su retirada está pendiente y se procesará en breve.</p><p>Cantidad: ${amount} ${currency}<br />Tarifa: ${fee} ${fee_coin}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacción: ${transaction_id}<br /><span id="network">La red: ${network}</span><br /><ul>${explorers}</ul><p> Saludos<br>Equipo de  ${api_name}  </p></div>',
	'title': '${currency} Retirada request'
});
let withdrawal_pending_fa = JSON.stringify({
	'html': '<div><p> کاربر عزیز${name} </p><p>شما درخواست برداشت به مبلغ ${amount} ${currency}.و به آدرس ${address} ثبت کرده اید. درخواست برداشت شما درحال انتظار بوده و به زودی مورد پردازش قرار خواهد گرفت.</p><p>مبلغ: ${amount} ${currency}<br />کارمزد: ${fee} ${fee_coin}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id="network">شبکه: ${network}</span><br /><ul>${explorers}</ul><p> با تشکر<br> ${api_name} تیم </p></div>',
	'title': '${currency} برداشت request'
});
let withdrawal_pending_fr = JSON.stringify({
	'html': '<div><p> Bonjour ${name} </p><p>Vous avez fait une demande de retrait de ${amount} ${currency}. Le statut de votre retrait est en attente et sera traité sous peu.</p><p>Montant: ${amount} ${currency}<br />Frais: ${fee} ${fee_coin}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id="network">Réseau: ${network}</span><br /><ul>${explorers}</ul><p> Bien cordialement<br> ${api_name} team </p></div>',
	'title': '${currency} withdrawal pending'
});
let withdrawal_pending_id = JSON.stringify({
	'html': '<div><p> Kepada ${name} </p><p>Anda telah membuat permintaan penarikan untuk ${amount} ${currency}. ke alamat ${address}. Penarikan Anda sedang dalam proses dan akan segera diproses.</p><p>Jumlah: ${amount} ${currency}<br />Biaya: ${fee} ${fee_coin}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id="network">Jaringan: ${network}</span><br /><ul>${explorers}</ul><p> Salam<br> ${api_name} tim </p></div>',
	'title': '${currency} Penarikan pending'
});
let withdrawal_pending_ja = JSON.stringify({
	'html': '<div><p> ${name}様 </p><p>お客様のアドレス${address}に${amount} ${currency}出金がリクエストされました。現在の取引状態は保留中ですが、まもなく完了する予定です。</p><p>金額: ${amount} ${currency}<br />手数料: ${fee} ${fee_coin}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id="network">ネットワーク: ${network}</span><br /><ul>${explorers}</ul><p> 敬具<br> ${api_name} チーム </p></div>',
	'title': '${currency}の引き出しは保留中'
});
let withdrawal_pending_ko = JSON.stringify({
	'html': '<div><p> ${name}님 </p><p>회원님의 ${amount} ${currency} 출금이 요청되었습니다. 출금 대기 중이며, 곧 완료될 예정입니다.</p><p>금액: ${amount} ${currency}<br />수수료: ${fee} ${fee_coin}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id="network">회로망: ${network}</span><br /><ul>${explorers}</ul><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>',
	'title': '${currency} 출금 보류 중'
});
let withdrawal_pending_pt = JSON.stringify({
	'html': '<div><p> Dear ${name} </p><p>Você fez uma solicitação de saque de ${amount} ${currency} para o endereço ${address}. Seu status de retirada está pendente e será processado em breve.</p><p>Quantia: ${amount} ${currency}<br />Taxa: ${fee} ${fee_coin}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id="network">Rede: ${network}</span><br /><ul>${explorers}</ul><p> Saudações<br> ${api_name} equipe </p></div>',
	'title': '${currency} Saque pendente'
});
let withdrawal_pending_vi = JSON.stringify({
	'html': '<div><p> ${name} thân mến </p><p>Quý khách vừa thực hiện yêu cầu rút ${amount} ${currency} tới địa chỉ ${address}. Yêu cầu rút tiền của quý khách đang ở trạng thái chờ xử lý và sẽ sớm được thực hiện.</p><p>Số lượng: ${amount} ${currency}<br />Phí: ${fee} ${fee_coin}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id="network">Mạng: ${network}</span><br /><ul>${explorers}</ul<p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>',
	'title': '${currency} Rút tiền chưa giải quyết'
});
let withdrawal_pending_zh = JSON.stringify({
	'html': '<div><p> ${name} </p><p>你向该地址${address}申请了${amount} ${currency}的提款请求，该提款地址正在等待处理并会很快得到处理。</p><p>金额: ${amount} ${currency}<br />手续费: ${fee} ${fee_coin}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id="network">网络: ${network}</span><br /><ul>${explorers}</ul><p> 感谢你的使用<br> ${api_name} 团队 </p></div>',
	'title': '${currency} 提款待處理'
});



// DEPOSIT_COMPLETED
let deposit_completed_en = JSON.stringify({
	'html': '<div><div><p> Dear ${name} </p><p> Your ${currency} deposit for ${amount} ${currency} is confirmed and completed and it is available in your ${currency} wallet.</p><p>Amount: ${amount} ${currency}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id="network">Network: ${network}</span><br />Fee: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Regards<br> ${api_name} team </p></div>',
	'title': '${currency} Deposit completed'
});
let deposit_completed_ar = JSON.stringify({
	'html': '<div><div><p> ${name}العزيز </p><p> تم تأكيد وديعة ${currency} بمبلغ ${amount} ${currency} واكتملت وهي متوفرة في محفظتك ${currency}.</p><p>المبلغ: ${amount} ${currency}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id="network">شبكة الاتصال: ${network}</span><br />الرسوم: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> تحية<br> فريق${api_name} </p></div>',
	'title': '${currency} ايداع completed'
});
let deposit_completed_de = JSON.stringify({
	'html': '<div><div><p> Sehr geehrte/r ${name} </p><p> Ihre ${currency} Anzahlung für ${amount} ${currency} ist bestätigt und abgeschlossen und steht in Ihrer ${currency} Geldbörse zur Verfügung.</p><p>Betrag: ${amount} ${currency}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id="network">Netzwerk: ${network}</span><br />Gebühr: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>',
	'title': '${currency} Einzahlung completed'
});
let deposit_completed_es = JSON.stringify({
	'html': '<div><div><p> Estimado/ Estimada ${name} </p><p> Su ${currency} depósito por ${amount} ${currency} está confirmado y completado y está disponible en su ${currency} billetera.</p><p>Cantidad: ${amount} ${currency}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacción: ${transaction_id}<br /><span id="network">La red: ${network}</span><br />Tarifa: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>',
	'title': '${currency} Depósito completed'
});
let deposit_completed_fa = JSON.stringify({
	'html': '<div><div><p> کاربر عزیز${name}} </p><p> واریز ${currency} شما به میزان ${amount} ${currency}  تکمیل و تایید شده و هم اکنون در کیف پول ${currency}  شما قابل استفاده است.</p><p>مبلغ: ${amount} ${currency}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id="network">شبکه: ${network}</span><br />کارمزد: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> با تشکر<br> ${api_name} تیم </p></div>',
	'title': '${currency} واریز completed'
});
let deposit_completed_fr = JSON.stringify({
	'html': '<div><div><p> Bonjour ${name} </p><p> Votre ${currency} dépôt pour ${amount} ${currency} est confirmé et complété et il est disponible dans votre portefeuille ${currency}.</p><p>Montant: ${amount} ${currency}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id="network">Réseau: ${network}</span><br />Frais: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Bien cordialement<br> ${api_name} team </p></div>',
	'title': '${currency} Deposit completed'
});
let deposit_completed_id = JSON.stringify({
	'html': '<div><div><p> Kepada ${name} </p><p> Deposit ${currency} Anda untukr ${amount} ${currency} telah dikonfirmasi dan berhasil dibuat dan tersedia di dompet ${currency} Anda.</p><p>Jumlah: ${amount} ${currency}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id="network">Jaringan: ${network}</span><br />Biaya: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Salam<br> ${api_name} tim </p></div>',
	'title': '${currency} Deposito completed'
});
let deposit_completed_ja = JSON.stringify({
	'html': '<div><div><p> ${name}様 </p><p> お客様の${amount} ${currency}入金が完了しました。お客様の${currency}ウォレットから確認および利用が可能です。 </p><p>金額: ${amount} ${currency}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id="network">ネットワーク: ${network}</span><br />手数料: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> 敬具<br> ${api_name} チーム </p></div>',
	'title': '${currency}デポジットが完了しました'
});
let deposit_completed_ko = JSON.stringify({
	'html': '<div><div><p> ${name}님} </p><p> 회원님의 ${amount} ${currency} 입금이 완료되었습니다. 회원님의 ${currency} 지갑에서 확인 및 이용하실 수 있습니다.</p><p>금액: ${amount} ${currency}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id="network">회로망: ${network}</span><br />수수료: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>',
	'title': '${currency} 입금 완료'
});
let deposit_completed_pt = JSON.stringify({
	'html': '<div><div><p> Dear ${name} </p><p> Seu ${currency} O depósito de ${amount} ${currency} foi confirmado e concluído e está disponível em sua ${currency} carteira.</p><p>Quantia: ${amount} ${currency}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id="network">Rede: ${network}</span><br />Taxa: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Saudações<br> ${api_name} equipe </p></div>',
	'title': '${currency} Depósito concluído'
});
let deposit_completed_vi = JSON.stringify({
	'html': '<div><div><p> ${name} thân mến </p><p> Giao dịch nạp ${currency} với số lượng ${amount} ${currency} đã được xác nhận và hoàn tất thành công. Số tiền đã được cập nhập vào ví ${currency} của quý khách.</p><p>Số lượng: ${amount} ${currency}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id="network">Mạng: ${network}</span><br />Phí: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>',
	'title': '${currency} Nạp tiền hoàn thành'
});
let deposit_completed_zh = JSON.stringify({
	'html': '<div><div><p> ${name}  </p><p> 你的${amount} ${currency}存款已完成。你的${currency}可在钱包中进行确认。</p><p>金额: ${amount} ${currency}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id="network">网络: ${network}</span><br />手续费: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>',
	'title': '${currency} 存款完成'
});

// DEPOSIT_PENDING
let deposit_pending_en = JSON.stringify({
	'html': '<div><div><p> Dear ${name} </p><p> You have a new deposit for ${amount} ${currency} pending in your ${api_name} wallet. Please wait until the transaction is confirmed and your funds will be available in your wallet. Your transaction requires ${confirmation} confirmation(s) on blockchain.</p><p>Amount: ${amount} ${currency}<br />Status: ${status}<br />Address: ${address}<br />Transaction ID: ${transaction_id}<br /><span id="network">Network: ${network}</span><br />Fee: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Regards<br> ${api_name} team </p></div>',
	'title': '${currency} Deposit pending'
});
let deposit_pending_ar = JSON.stringify({
	'html': '<div><div><p> ${name}العزيز </p><p> ${amount} لديك إيداع جديد بمبلغ ${currency} في قيد الانتظار في محفظتك ${api_name} .يرجى الانتظار حتى يتم تأكيد المعاملة وستتوفر أموالك في محفظتك. تتطلب معاملتك. ${confirmation} تأكيداً (تأكيداتٍ) على البلوك تشين.</p><p>المبلغ: ${amount} ${currency}<br />الحالة: ${status}<br />العنوان: ${address}<br />معرّف المعاملة: ${transaction_id}<br /><span id="network">شبكة الاتصال: ${network}</span><br />الرسوم: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> تحية<br> فريق${api_name} </p></div>',
	'title': '${currency} ايداع pending'
});
let deposit_pending_de = JSON.stringify({
	'html': '<div><div><p>Sehr geehrte/r ${name} </p><p> Sie haben eine neue Einzahlung von ${amount} ${currency} in Ihrer ${api_name} Geldbörse ausstehend. Bitte warten Sie, bis die Transaktion bestätigt ist und Ihr Guthaben in Ihrer Geldbörse verfügbar ist. Ihre Transaktion erfordert ${confirmation} Bestätigung(en) in der Blockchain.</p><p>Betrag: ${amount} ${currency}<br />Status: ${status}<br />Adresse: ${address}<br />Transaktionsnummer: ${transaction_id}<br /><span id="network">Netzwerk: ${network}</span><br />Gebühr: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Mit freundlichen Grüßen<br> ${api_name} team </p></div>',
	'title': '${currency} Einzahlung pending'
});
let deposit_pending_es = JSON.stringify({
	'html': '<div><div><p> Estimado/ Estimada ${name} </p><p>Tiene un nuevo depósito por ${amount} ${currency} pendiente en su ${api_name} billetera. Por favor espere hasta que la transacción se confirme y sus fondos estarán disponibles en su billetera. Su transacción requiere ${confirmation} confirmación(es) en la cadena de bloqueo.</p><p>Cantidad: ${amount} ${currency}<br />Estado: ${status}<br />Dirección: ${address}<br />ID de transacción: ${transaction_id}<br /><span id="network">La red: ${network}</span><br />Tarifa: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Saludos<br>Equipo de  ${api_name}  </p></div>',
	'title': '${currency} Depósito pending'
});
let deposit_pending_fa = JSON.stringify({
	'html': '<div><div><p> کاربر عزیز${name} </p><p> شما یک واریز جدید به مبلغ ${amount} ${currency} دارید که در حال انتظار برای واریز به کیف پول ${api_name} می باشد. لطفا تا تایید تراکنش خود و مشاهده مبلغ در کیف پول خود تامل فرمایید. تراکنش شما حداقل به  ${confirmation} تایید بر روی شبکه بلاکچین نیاز دارد.` </p><p>مبلغ: ${amount} ${currency}<br />Status: ${status}<br />آدرس: ${address}<br />شماره پیگیری تراکنش: ${transaction_id}<br /><span id="network">شبکه: ${network}</span><br />کارمزد: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> با تشکر<br> ${api_name} تیم </p></div>',
	'title': '${currency} واریز pending'
});
let deposit_pending_fr = JSON.stringify({
	'html': '<div><div><p> Bonjour ${name} </p><p> Vous avez un nouveau dépôt pour ${amount} ${currency} en attente dans votre portefeuille ${api_name} . Veuillez attendre que la transaction soit confirmée et vos fonds seront disponible dans votre portefeuille. Votre transaction nécessite ${confirmation} confirmation(s) sur la blockchain.</p><p>Montant: ${amount} ${currency}<br />Status: ${status}<br />Addresse: ${address}<br />Identité de la transaction: ${transaction_id}<br /><span id="network">Réseau: ${network}</span><br />Frais: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Bien cordialement<br> ${api_name} team </p></div>',
	'title': '${currency} Deposit pending'
});
let deposit_pending_id = JSON.stringify({
	'html': '<div><div><p> Kepada ${name} </p><p> Ada deposit baru untuk ${amount} ${currency} yang sedang dalam proses di dompet ${api_name} Anda. Mohon ditunggu sampai transaksi dikonfirmasi dan dana Anda akan tersedia di dompet Anda. Please wait until the transaction is confirmed and your funds will be available in your wallet. Transaksi Anda memerlukan ${confirmation} konfirmasi dalam blockchain.</p><p>Jumlah: ${amount} ${currency}<br />Status: ${status}<br />Alamat: ${address}<br />ID Transaksi: ${transaction_id}<br /><span id="network">Jaringan: ${network}</span><br />Biaya: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Salam<br> ${api_name} tim </p></div>',
	'title': '${currency} Deposito pending'
});
let deposit_pending_ja = JSON.stringify({
	'html': '<div><div><p> ${name}様 </p><p> 現在、お客様の${api_name}ウォレットへの${amount} ${currency}入金は保留中です。取引が承認されるまでお待ちください お客様の取引には、ブロックチェーン上で${confirmation}個の承認が必要です。</p><p>金額: ${amount} ${currency}<br />取引状態: ${status}<br />アドレス: ${address}<br />取引ID: ${transaction_id}<br /><span id="network">ネットワーク: ${network}</span><br />手数料: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> 敬具<br> ${api_name} チーム </p></div>',
	'title': '${currency}デポジットは保留中です'
});
let deposit_pending_ko = JSON.stringify({
	'html': '<div><div><p> ${name}님 </p><p> 회원님의 ${api_name} 지갑으로 ${amount} ${currency} 입금이 진행 중입니다. 거래가 승인되고 지갑에 자금이 입금될 때까지 기다려주십시오. 회원님의 거래에는 비트코인 블록체인 상 ${confirmation} 개의 승인이 요구됩니다. </p><p>금액: ${amount} ${currency}<br />입금 상태: ${status}<br />주소: ${address}<br />거래 ID 확인: ${transaction_id}<br /><span id="network">회로망: ${network}</span><br />수수료: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> 이용해 주셔서 감사합니다.<br> ${api_name} 팀 </p></div>',
	'title': '${currency} 입금 보류 중'
});
let deposit_pending_pt = JSON.stringify({
	'html': '<div><div><p> Dear ${name} </p><p> Você tem um novo depósito de ${amount} ${currency} pendente em sua carteira ${api_name} . Aguarde até que a transação seja confirmada e seus fundos estejam disponíveis em sua carteira. Sua transação requer ${confirmation} confirmação ou confirmações no blockchain.</p><p>Quantia: ${amount} ${currency}<br />Status: ${status}<br />Endereço: ${address}<br />ID da transação: ${transaction_id}<br /><span id="network">Rede: ${network}</span><br />Taxa: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Saudações<br> ${api_name} equipe </p></div>',
	'title': '${currency} Depósito Pendente'
});
let deposit_pending_vi = JSON.stringify({
	'html': '<div><div><p> ${name} thân mến </p><p> Một giao dịch nạp ${amount} ${currency} vào địa chỉ ví ${api_name} của quý khách đang chờ được xử lý. Vui lòng chờ đợi cho đến khi giao dịch được xác nhận và tiền được nạp vào ví của quý khách. Yêu cầu giao dịch của quý khách cần nhận được ${confirmation} kết quả đồng thuận trên blockchain.</p><p>Số lượng: ${amount} ${currency}<br />Trạng thái: ${status}<br />Địa chỉ: ${address}<br />ID giao dịch: ${transaction_id}<br /><span id="network">Mạng: ${network}</span><br />Phí: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi. <br> Đội ngũ  ${api_name}  </p></div>',
	'title': '${currency} Nạp tiền chưa giải quyết'
});
let deposit_pending_zh = JSON.stringify({
	'html': '<div><div><p> ${name} </p><p> 你的${api_name}钱包中有一笔${amount} ${currency}的新存款正在等待处理，待交易被确认后，资金才会进入到你的钱包中，该交易需要在区块链上进行${confirmation}确认。</p><p>金额: ${amount} ${currency}<br />状态: ${status}<br />地址: ${address}<br />交易 ID: ${transaction_id}<br /><span id="network">网络: ${network}</span><br />手续费: ${fee} ${fee_coin}<br /><ul>${explorers}</ul></div><p> 感谢你的使用<br> ${api_name} 团队 </p></div>',
	'title': '${currency} 存款待處理'
});

module.exports = {
	async up(queryInterface) {

		/*---------*/
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{en, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_en}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ar, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_ar}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{de, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_de}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{es, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_es}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fa, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_fa}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fr, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_fr}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{id, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_id}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ja, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_ja}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ko, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_ko}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{pt, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_pt}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{vi, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_vi}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{zh, WITHDRAWAL_REQUEST}', 
				'${withdrawal_request_zh}'
			)`);


		/*----------*/
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{en, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_en}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ar, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_ar}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{de, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_de}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{es, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_es}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fa, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_fa}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fr, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_fr}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{id, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_id}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ja, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_ja}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ko, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_ko}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{pt, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_pt}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{vi, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_vi}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{zh, WITHDRAWAL_COMPLETED}', 
				'${withdrawal_completed_zh}'
			)`);

		/*---------*/
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{en, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_en}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ar, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_ar}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{de, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_de}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{es, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_es}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fa, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_fa}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fr, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_fr}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{id, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_id}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ja, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_ja}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ko, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_ko}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{pt, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_pt}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{vi, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_vi}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{zh, WITHDRAWAL_PENDING}', 
				'${withdrawal_pending_zh}'
			)`);

		/*---------*/
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{en, DEPOSIT_COMPLETED}', 
				'${deposit_completed_en}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ar, DEPOSIT_COMPLETED}', 
				'${deposit_completed_ar}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{de, DEPOSIT_COMPLETED}', 
				'${deposit_completed_de}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{es, DEPOSIT_COMPLETED}', 
				'${deposit_completed_es}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fa, DEPOSIT_COMPLETED}', 
				'${deposit_completed_fa}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fr, DEPOSIT_COMPLETED}', 
				'${deposit_completed_fr}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{id, DEPOSIT_COMPLETED}', 
				'${deposit_completed_id}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ja, DEPOSIT_COMPLETED}', 
				'${deposit_completed_ja}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ko, DEPOSIT_COMPLETED}', 
				'${deposit_completed_ko}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{pt, DEPOSIT_COMPLETED}', 
				'${deposit_completed_pt}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{vi, DEPOSIT_COMPLETED}', 
				'${deposit_completed_vi}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{zh, DEPOSIT_COMPLETED}', 
				'${deposit_completed_zh}'
			)`);
		/*---------*/

		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{en, DEPOSIT_PENDING}', 
				'${deposit_pending_en}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ar, DEPOSIT_PENDING}', 
				'${deposit_pending_ar}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{de, DEPOSIT_PENDING}', 
				'${deposit_pending_de}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{es, DEPOSIT_PENDING}', 
				'${deposit_pending_es}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fa, DEPOSIT_PENDING}', 
				'${deposit_pending_fa}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{fr, DEPOSIT_PENDING}', 
				'${deposit_pending_fr}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{id, DEPOSIT_PENDING}', 
				'${deposit_pending_id}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ja, DEPOSIT_PENDING}', 
				'${deposit_pending_ja}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{ko, DEPOSIT_PENDING}', 
				'${deposit_pending_ko}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{pt, DEPOSIT_PENDING}', 
				'${deposit_pending_pt}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{vi, DEPOSIT_PENDING}', 
				'${deposit_pending_vi}'
			)`);
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"SET
			${COLUMN} = jsonb_set(${COLUMN}, '{zh, DEPOSIT_PENDING}', 
				'${deposit_pending_zh}'
			)`);

	},

	down: () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
};
