# == Schema Information
#
# Table name: applies
#
#  id         :integer          not null, primary key
#  first_name :string
#  last_name  :string
#  age        :integer
#  email      :string
#  phone      :string
#  motivation :text
#  batch_id   :integer
#  city_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  tracked    :boolean          default(FALSE), not null
#

class Apply < ActiveRecord::Base
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone, presence: true
  validates :age, presence: true, numericality: { only_integer: true }
  validates :email, presence: true, email: true
  validates :motivation, presence: true, length: { minimum: 140 }

  after_create :push_to_trello, if: :push_to_trello?

  def push_to_trello
    card = PushToTrelloRunner.new(self).run
    PushStudentToCrmRunner.new(card, self).run if Rails.env.production?
    SubscribeToNewsletter.new(email).run  if Rails.env.production?
  end

  def tracked?
    tracked
  end

  def push_to_trello?
    batch_id && !Rails.env.test?
  end

  def batch
    @batch ||= AlumniClient.new.batch(batch_id)
  end
end
